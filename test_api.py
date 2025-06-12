import requests
import json

# Test data
test_data = {
    "височина": 170,
    "тегло": 70,
    "талия": 85,
    "гръдна_обиколка": 95,
    "ширина_дреха": 50,
    "пол": "F",
    "телосложение": "average",
    "материя": "elastic",
    "тип_дреха": "shirt"
}

# Make the request
try:
    response = requests.post(
        'http://localhost:5001/api/predict-size',
        json=test_data,
        headers={'Content-Type': 'application/json'}
    )
    
    print("Status Code:", response.status_code)
    print("Response Headers:", response.headers)
    print("Response Body:", response.text)
    
except Exception as e:
    print("Error:", str(e)) 