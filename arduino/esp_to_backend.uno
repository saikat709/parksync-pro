#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "Chowdhury_Pathagar";
const char* password = "azim@2025";

const char* baseUrl = "http://192.168.0.108:8000";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
}

void loop() {
  int parkingId = startParking("a1", 2);
  Serial.printf("Received parking_id: %d\n", parkingId);
  delay(2000);

  float fare = endParking(parkingId);
  Serial.printf("Received fare: %.2f\n", fare);
  delay(2000);

  createLog("entry", "a1", 2);
  delay(10000);
}

// Returns parking_id from response, or -1 on failure
int startParking(const char* zone_id, int slot) {
  if (WiFi.status() != WL_CONNECTED) return -1;

  HTTPClient http;
  String url = String(baseUrl) + "/parking/start/?zone_id=" + zone_id + "&slot=" + String(slot);
  http.begin(url);
  int httpResponseCode = http.POST("");
  if (httpResponseCode == 200) {
    String payload = http.getString();
    StaticJsonDocument<200> doc;
    DeserializationError error = deserializeJson(doc, payload);
    if (!error && doc.containsKey("parking_id")) {
      int parking_id = doc["parking_id"];
      http.end();
      return parking_id;
    }
  }
  Serial.printf("startParking error: %d\n", httpResponseCode);
  http.end();
  return -1;
}

// Returns fare from response, or -1 on failure
float endParking(int parking_id) {
  if (WiFi.status() != WL_CONNECTED) return -1;

  HTTPClient http;
  String url = String(baseUrl) + "/parking/end/?parking_id=" + String(parking_id);
  http.begin(url);
  int httpResponseCode = http.POST("");
  if (httpResponseCode == 200) {
    String payload = http.getString();
    StaticJsonDocument<200> doc;
    DeserializationError error = deserializeJson(doc, payload);
    if (!error && doc.containsKey("fare")) {
      float fare = doc["fare"];
      http.end();
      return fare;
    }
  }
  Serial.printf("endParking error: %d\n", httpResponseCode);
  http.end();
  return -1;
}

void createLog(const char* type, const char* zone, int slot) {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  String url = String(baseUrl) + "/log/";
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  String payload = "{\"type\":\"" + String(type) + "\",\"zone\":\"" + String(zone) + "\",\"slot\":" + String(slot) + "}";
  int httpResponseCode = http.POST(payload);
  Serial.printf("Create Log response: %d\n", httpResponseCode);
  http.end();
}