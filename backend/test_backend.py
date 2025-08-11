import requests

base_url = "http://127.0.0.1:8000"

# check base
print("base - get")
response = requests.get(f"{base_url}/")
print("Response Status Code:", response.status_code)
print("Response JSON:", response.json())


# get logs
print("\n/logs/ - get")
response = requests.get(f"{base_url}/log/?page=1&page_size=10' ")
print("Response Status Code:", response.status_code)
print("Response JSON:", response.json())


# create a new log
log_data = {
    "type": "enter",
    "zone": "Zone A",
    "slot": "Slot 1",
}

print("\n/logs/ - post")
response = requests.post(f"{base_url}/log/", json=log_data)
print("Create Log Response Status Code:", response.status_code)
print("Create Log Response JSON:", response.json())

