#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <RTClib.h>
#include <ESP32Servo.h>
#include <ArduinoJson.h>
#include <TM1637Display.h>

// Wi-Fi credentials
const char* ssid      = "YOUR_WIFI_SSID";
const char* password  = "YOUR_WIFI_PASSWORD";
const char* serverUrl = "http://your-backend.com/api/parking";

// Pin definitions
#define TRIG1 26    // Ultrasonic sensor 1
#define ECHO1 27 
#define TRIG2 25    // Ultrasonic sensor 2
#define ECHO2 33
#define TRIG3 32    // Ultrasonic sensor 3
#define ECHO3 35
#define IR1   14    // IR sensor outside (entry)
#define IR2   12    // IR sensor inside (exit)
#define SERVO 13    // Servo motor for gate
#define TM1637_CLK 19  // TM1637 clock pin
#define TM1637_DIO 23  // TM1637 data pin

// Initialize displays
LiquidCrystal_I2C lcd1(0x27, 16, 2); // LCD for slots
TM1637Display tm1637(TM1637_CLK, TM1637_DIO); // TM1637 for time/cost
RTC_DS3231 rtc;
Servo gateServo;

// Parking slot status
bool slotOccupied[3] = {false, false, false};
int freeSlots = 3;
int entryTimes[3] = {0, 0, 0}; // Store entry time for each slot (in seconds)

// IR sensor state tracking
bool ir1State = HIGH;
bool ir2State = HIGH;
bool entering = false;

// Cost calculation
const float costPerMinute = 1.0; // $1 per minute

void setup() {
  Serial.begin(115200);
  
  // Initialize pins
  pinMode(TRIG1, OUTPUT); pinMode(ECHO1, INPUT);
  pinMode(TRIG2, OUTPUT); pinMode(ECHO2, INPUT);
  pinMode(TRIG3, OUTPUT); pinMode(ECHO3, INPUT);
  pinMode(IR1, INPUT);
  pinMode(IR2, INPUT);
  
  // Initialize servo
  gateServo.attach(SERVO);
  gateServo.write(0); // Gate closed
  
  // Initialize displays
  lcd1.init(); lcd1.backlight();
  lcd1.setCursor(0, 0); lcd1.print("Free Slots: 3");
  tm1637.setBrightness(0x0f); // Max brightness
  tm1637.showNumberDec(0, true); // Initialize TM1637
  
  // Initialize RTC
  if (!rtc.begin()) {
    Serial.println("Couldn't find RTC");
    while (1);
  }
  if (rtc.lostPower()) {
    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
  }
  
  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

void loop() {
  checkUltrasonicSensors();
  checkIRSensors();
  updateTimeDisplay();
  delay(100);
}

void checkUltrasonicSensors() {
  int distances[3];
  distances[0] = getDistance(TRIG1, ECHO1);
  distances[1] = getDistance(TRIG2, ECHO2);
  distances[2] = getDistance(TRIG3, ECHO3);
  
  int newFreeSlots = 3;
  for (int i = 0; i < 3; i++) {
    bool wasOccupied = slotOccupied[i];
    slotOccupied[i] = (distances[i] < 300 && distances[i] > 0);
    if (slotOccupied[i]) newFreeSlots--;
    
    // Detect car exit
    if (wasOccupied && !slotOccupied[i] && entryTimes[i] != 0) {
      displayCost(i);
      sendParkingUpdate("A", i + 1, "exit");
      entryTimes[i] = 0;
    }
  }
  
  if (newFreeSlots != freeSlots) {
    freeSlots = newFreeSlots;
    updateSlotDisplay();
  }
}

int getDistance(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  long duration = pulseIn(echoPin, HIGH);
  int distance = duration * 0.034 / 2;
  return distance;
}

void checkIRSensors() {
  bool newIr1State = digitalRead(IR1);
  bool newIr2State = digitalRead(IR2);
  
  // Detect entry (IR1 triggered first)
  if (newIr1State == LOW && ir1State == HIGH && !entering) {
    entering = true;
    openGate();
  }
  
  // Complete entry (IR2 triggered after IR1)
  if (entering && newIr2State == LOW && ir2State == HIGH) {
    closeGate();
    entering = false;
    for (int i = 0; i < 3; i++) {
      if (slotOccupied[i] && entryTimes[i] == 0) {
        entryTimes[i] = rtc.now().unixtime();
        sendParkingUpdate("A", i + 1, "enter");
        break;
      }
    }
  }
  
  // Detect exit (IR2 triggered first)
  if (newIr2State == LOW && ir2State == HIGH && !entering) {
    openGate();
  }
  
  // Complete exit (IR1 triggered after IR2)
  if (newIr1State == LOW && ir1State == HIGH && !entering) {
    closeGate();
  }
  
  ir1State = newIr1State;
  ir2State = newIr2State;
}

void openGate() {
  gateServo.write(90); // Gate open
}

void closeGate() {
  gateServo.write(0); // Gate closed
}

void updateSlotDisplay() {
  lcd1.clear();
  lcd1.setCursor(0, 0);
  lcd1.print("Free Slots: ");
  lcd1.print(freeSlots);
}

void updateTimeDisplay() {
  DateTime now = rtc.now();
  int timeValue = now.hour() * 100 + now.minute(); // HHMM format
  tm1637.showNumberDecEx(timeValue, 0b01000000, true); // Show with colon
}

void displayCost(int slot) {
  int duration = rtc.now().unixtime() - entryTimes[slot];
  float cost = (duration / 60.0) * costPerMinute;
  int costDisplay = (int)(cost * 100); // Convert to cents for display (e.g., $12.34 -> 1234)
  
  tm1637.showNumberDec(costDisplay, true); // Show cost
  delay(5000); // Display for 5 seconds
  updateTimeDisplay(); // Revert to time
}

void sendParkingUpdate(String zone, int slot, String state) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    
    // Create JSON object
    StaticJsonDocument<200> doc;
    doc["zone"] = zone;
    doc["slot"] = slot;
    doc["state"] = state;
    
    // Serialize JSON to string
    String payload;
    serializeJson(doc, payload);
    
    // Send POST request
    int httpCode = http.POST(payload);
    
    if (httpCode > 0) {
      Serial.printf("HTTP POST %s: %d\n", state.c_str(), httpCode);
    } else {
      Serial.println("HTTP POST failed");
    }
    http.end();
  }
}
