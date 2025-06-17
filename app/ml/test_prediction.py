import requests
import json
import logging

logging.basicConfig(level=logging.DEBUG)

# Test data that matches our training data format
test_data = {
    "height": 175,
    "weight": 70,
    "waist": 85,
    "chest": 95,
    "garment_width": 50,
    "gender": "male",
    "body_type": "medium",
    "material": "elastic",
    "garment_type": "shirt"
}

# Make request to the prediction endpoint
try:
    response = requests.post(
        "http://localhost:5001/predict",
        json=test_data,
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    )
    
    logging.info(f"Status Code: {response.status_code}")
    logging.info(f"Response Headers: {dict(response.headers)}")
    
    if response.ok:
        result = response.json()
        logging.info(f"Response Body: {json.dumps(result, indent=2)}")
    else:
        logging.error(f"Error Response: {response.text}")
        
except Exception as e:
    logging.error(f"Request failed: {str(e)}") 