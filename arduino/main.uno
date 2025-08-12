#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>  // Include the ArduinoJson library
#include <TM1637Display.h>
#include <ESP32Servo.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// ----------------------------- Pins -----------------------------
#define IR_ENTRY_PIN   25   // Entry IR (gate 1)
#define IR_EXIT_PIN    34   // Exit IR (gate 2) - input only, no internal pullups
#define SERVO_ENTRY     2   // Entry gate servo
#define SERVO_EXIT     13   // Exit gate servo

// TM1637 (4-digit)
#define TM1637_CLK     32
#define TM1637_DIO     33

// Ultrasonic sensors (3 slots)
#define TRIG_PIN1      19
#define ECHO_PIN1       5
#define TRIG_PIN2      18
#define ECHO_PIN2       4
#define TRIG_PIN3      27
#define ECHO_PIN3      14

// I2C LCD (20x4 at 0x27). We'll only use three rows for Slot 1/2/3.
LiquidCrystal_I2C lcd(0x27, 20, 4);

// ------------------------- Config knobs -------------------------
const int OPEN_ANGLE   = 0;    // you confirmed these angles are correct for your hardware
const int CLOSED_ANGLE = 90;

const int  IR_ACTIVE_LEVEL     = LOW;  // flip to HIGH if your IR outputs HIGH when blocked
const long SLOT_OCCUPIED_CM    = 7;    // occupied if <= 7 cm
const unsigned long HOLD_OPEN_MS = 5000; // keep gate open >= 5 s after IR clears
const unsigned long DEBOUNCE_MS   = 50;  // IR debouncing

// --------------------------- Globals ----------------------------
TM1637Display display(TM1637_CLK, TM1637_DIO);

Servo servoEntry;
Servo servoExit;

// Gate state machine
struct Gate {
  int irPin;
  Servo* servo;
  bool isOpen = false;

  // debounced IR
  int lastRaw = -1;
  bool irStable = false;
  unsigned long lastRawChangeMs = 0;

  // closing hold time after clear
  unsigned long holdUntilMs = 0;
};

Gate entryGate{IR_ENTRY_PIN, &servoEntry};
Gate exitGate {IR_EXIT_PIN , &servoExit };

// Slot occupancy + timing
struct Slot {
  int trigPin;
  int echoPin;
  bool occupied = false;
  bool lastOccupied = true; // force first LCD update
};

Slot slots[3] = {
  {TRIG_PIN1, ECHO_PIN1, false, true},
  {TRIG_PIN2, ECHO_PIN2, false, true},
  {TRIG_PIN3, ECHO_PIN3, false, true}
};

// Parking session management
bool timerRunning = false;
int  activeSlot   = -1;
unsigned long startTimeMs = 0;
unsigned long lastFee = 0; // cache until exit IR displays it

unsigned long parkingId = 0; // Store parking ID
float fare = 0.0;  // Store the fare

const char* ssid = "IIT-WIFI";
const char* password = "IIT786445";

// ---------------------- Helper: ultrasonic ----------------------
long readUltrasonicDistance(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH, 30000); // timeout 30ms
  if (duration == 0) return -1;  // no echo
  long distance = duration * 0.034 / 2; // cm
  return distance;
}

// --------------------- Helper: update LCD -----------------------
void updateLCD(bool force = false) {
  static bool lastS1 = !slots[0].occupied;
  static bool lastS2 = !slots[1].occupied;
  static bool lastS3 = !slots[2].occupied;

  bool changed = force || (lastS1 != slots[0].occupied) || (lastS2 != slots[1].occupied) || (lastS3 != slots[2].occupied);
  if (!changed) return;

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Slot 1: ");
  lcd.print(slots[0].occupied ? "Occupied   " : "Free       ");

  lcd.setCursor(0, 1);
  lcd.print("Slot 2: ");
  lcd.print(slots[1].occupied ? "Occupied   " : "Free       ");

  lcd.setCursor(0, 2);
  lcd.print("Slot 3: ");
  lcd.print(slots[2].occupied ? "Occupied   " : "Free       ");

  lastS1 = slots[0].occupied;
  lastS2 = slots[1].occupied;
  lastS3 = slots[2].occupied;
}

// ------------------ Helper: IR debounce + gate logic -----------
void serviceGate(Gate& g, unsigned long nowMs) {
  int raw = digitalRead(g.irPin);
  if (g.lastRaw == -1) {
    g.lastRaw = raw;
    g.irStable = (raw == IR_ACTIVE_LEVEL);
    g.lastRawChangeMs = nowMs;
  }

  if (raw != g.lastRaw) {
    g.lastRaw = raw;
    g.lastRawChangeMs = nowMs;
  }
  if (nowMs - g.lastRawChangeMs >= DEBOUNCE_MS) {
    g.irStable = (g.lastRaw == IR_ACTIVE_LEVEL);
  }

  // Logic: open while IR active; after inactive, keep open until holdUntil
  if (g.irStable) {
    if (!g.isOpen) {
      g.servo->write(OPEN_ANGLE);
      g.isOpen = true;
    }
    g.holdUntilMs = nowMs + HOLD_OPEN_MS;
  } else {
    if (g.isOpen && nowMs >= g.holdUntilMs) {
      g.servo->write(CLOSED_ANGLE);
      g.isOpen = false;
    }
  }
}

// ------------------ Helper: Parking Start and Complete ------------------
unsigned long startParking(const char* zoneId, int slot) {
  HTTPClient http;
  String url = "http://10.100.201.91:8000/parking/start/?zone_id=" + String(zoneId) + "&slot=" + String(slot);
  
  http.begin(url);
  http.addHeader("accept", "application/json");
  int httpResponseCode = http.POST("");

  String payload = "";

  if (httpResponseCode > 0) {
    payload = http.getString();
    Serial.println("Parking Start Response:");
    Serial.println(payload);

    // Parse the parking ID from the response
    parkingId = parseParkingId(payload);  
  } else {
    payload = "Error code: " + String(httpResponseCode);
  }

  http.end();
  return parkingId;
}

unsigned long parseParkingId(const String& payload) {
  StaticJsonDocument<200> doc;
  
  // Parse the JSON payload
  DeserializationError error = deserializeJson(doc, payload);
  if (error) {
    Serial.print(F("Failed to parse JSON: "));
    Serial.println(error.f_str());
    return 0;  // Return 0 if there was an error
  }

  // Assuming the parking ID is inside the JSON response with the key "parking_id"
  return doc["parking_id"] | 0;  // Default to 0 if "parking_id" doesn't exist
}

float completeParking() {
  if (parkingId == 0) return 0.0;

  HTTPClient http;
  String url = "http://10.100.201.91:8000/parking/end/?parking_id=" + String(parkingId);
  
  http.begin(url);
  http.addHeader("accept", "application/json");
  int httpResponseCode = http.POST("");

  String payload = "";

  if (httpResponseCode > 0) {
    payload = http.getString();
    Serial.println("Parking Complete Response:");
    Serial.println(payload);

    // Parse the fare from the response
    fare = parseFare(payload);
  } else {
    payload = "Error code: " + String(httpResponseCode);
  }

  http.end();
  return fare;
}

float parseFare(const String& payload) {
  StaticJsonDocument<200> doc;
  
  // Parse the JSON payload
  DeserializationError error = deserializeJson(doc, payload);
  if (error) {
    Serial.print(F("Failed to parse JSON: "));
    Serial.println(error.f_str());
    return 0.0;  // Return 0.0 if there was an error
  }

  // Assuming the fare is inside the JSON response with the key "fare"
  return doc["fare"] | 0.0;  // Default to 0.0 if "fare" doesn't exist
}

// ---------------------------- Setup ----------------------------
void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi");

  // Setup everything as needed
  pinMode(IR_ENTRY_PIN, INPUT);
  pinMode(IR_EXIT_PIN , INPUT);
  pinMode(TRIG_PIN1, OUTPUT); pinMode(ECHO_PIN1, INPUT);
  pinMode(TRIG_PIN2, OUTPUT); pinMode(ECHO_PIN2, INPUT);
  pinMode(TRIG_PIN3, OUTPUT); pinMode(ECHO_PIN3, INPUT);

  servoEntry.setPeriodHertz(50);
  servoExit.setPeriodHertz(50);
  servoEntry.attach(SERVO_ENTRY, 500, 2500);
  servoExit.attach(SERVO_EXIT, 500, 2500);
  
  display.setBrightness(0x0f);
  display.clear();

  lcd.init();
  lcd.backlight();

  // Splash screen
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Welcome to");
  lcd.setCursor(0,1);
  lcd.print("  ParkSyncPro");
  delay(500);
  
  updateLCD(true);
}

// ---------------------------- Loop -----------------------------
void loop() {
  unsigned long now = millis();

  // --- Gates ---
  serviceGate(entryGate, now);
  serviceGate(exitGate , now);

  // --- Slots & Timer ---
  for (int i = 0; i < 3; i++) {
    long d = readUltrasonicDistance(slots[i].trigPin, slots[i].echoPin);
    bool occ = (d > 0 && d <= SLOT_OCCUPIED_CM);

    if (occ != slots[i].occupied) {
      slots[i].occupied = occ;
      Serial.printf("Slot %d: %s (d=%ld cm)\n", i+1, occ ? "Occupied" : "Free", d);

      // Start timer when a slot turns Occupied and no timer is running
      if (occ && !timerRunning) {
        timerRunning = true;
        activeSlot = i;
        startTimeMs = now;
        lastFee = 0;
        
        // Start parking session
        startParking("a1", i+1);
      }

      // Stop timer when the active slot turns Free
      if (!occ && timerRunning && activeSlot == i) {
        timerRunning = false;
        unsigned long elapsedSec = (now - startTimeMs) / 1000;
        lastFee = elapsedSec * 2;
        if (lastFee > 9999) lastFee = 9999;
        Serial.printf("Parking time: %lu s, Fee: %lu taka\n", elapsedSec, lastFee);

        // Complete parking session
        fare = completeParking();
        display.showNumberDec((int)fare, false);  // Show the fare on TM1637 display
      }
    }
  }

  // Update LCD only when slot states change
  updateLCD();

  delay(50); // stable loop
}