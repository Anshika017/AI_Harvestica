import os
import pickle
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Absolute paths for model and scaler files
model_path = os.path.abspath('classifier1.pkl')
scaler_path = os.path.abspath('scaler.pkl')

print(f"Looking for model at: {model_path}")
print(f"Looking for scaler at: {scaler_path}")

# Load model and scaler with error handling
try:
    model = pickle.load(open(model_path, 'rb'))
    scaler = pickle.load(open(scaler_path, 'rb'))
    print("Model and Scaler loaded successfully!")
except FileNotFoundError:
    print(f"ERROR: Model or Scaler file NOT FOUND at:\n{model_path}\n{scaler_path}")
    exit()
except Exception as e:
    print(f"ERROR: Failed to load model or scaler: {str(e)}")
    exit()

@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Fertilizer Recommendation API is running!'}), 200

@app.route('/api/recommend', methods=['POST'])
def recommend_fertilizer():
    try:
        data = request.get_json()
        
        # Input validation
        nitrogen = data.get('nitrogen')
        phosphorus = data.get('phosphorus')
        potassium = data.get('potassium')

        if not all([nitrogen, phosphorus, potassium]):
            return jsonify({'error': 'Missing required nutrients (nitrogen, phosphorus, potassium)'}), 400

        # Convert input to float and handle ValueError
        try:
            nitrogen = float(nitrogen)
            phosphorus = float(phosphorus)
            potassium = float(potassium)
        except ValueError:
            return jsonify({'error': 'Invalid input values. Please provide numeric values for all nutrients.'}), 400

        # Prediction
        features = np.array([[nitrogen, phosphorus, potassium]])
        features_scaled = scaler.transform(features)
        prediction = model.predict(features_scaled)

        # Fertilizer mapping
        fertilizer_mapping = {
            0: "TEN-TWENTY SIX-TWENTY SIX",
            1: "Fourteen-Thirty Five-Fourteen",
            2: "Seventeen-Seventeen-Seventeen",
            3: "TWENTY-TWENTY",
            4: "TWENTY EIGHT-TWENTY EIGHT",
            5: "DAP",
            6: "UREA"
        }

        fertilizer = fertilizer_mapping.get(prediction[0], "Unknown Fertilizer")
        return jsonify({'recommended_fertilizer': fertilizer})

    except Exception as e:
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5003, host='0.0.0.0')
