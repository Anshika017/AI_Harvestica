from flask import Flask, request, jsonify
import numpy as np
import pickle
from flask_cors import CORS

# Load trained models
model = pickle.load(open("model.pkl", "rb"))
sc = pickle.load(open("standardscaler.pkl", "rb"))
ms = pickle.load(open("minmaxscaler.pkl", "rb"))

# Crop dictionary
crop_dict = {
    1: "Rice", 2: "Maize", 3: "Jute", 4: "Cotton", 5: "Coconut", 6: "Papaya",
    7: "Orange", 8: "Apple", 9: "Muskmelon", 10: "Watermelon", 11: "Grapes",
    12: "Mango", 13: "Banana", 14: "Pomegranate", 15: "Lentil", 16: "Blackgram",
    17: "Mungbean", 18: "Mothbeans", 19: "Pigeonpeas", 20: "Kidneybeans",
    21: "Chickpea", 22: "Coffee"
}

# Create Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

@app.route("/")
def home():
    return jsonify({"message": "Welcome to Crop Recommendation System API!"})

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        feature_list = [
            float(data["Nitrogen"]),
            float(data["Phosphorus"]),
            float(data["Potassium"]),
            float(data["Temperature"]),
            float(data["Humidity"]),
            float(data["Ph"]),
            float(data["Rainfall"]),
        ]

        single_pred = np.array(feature_list).reshape(1, -1)
        scaled_features = ms.transform(single_pred)
        final_features = sc.transform(scaled_features)
        prediction = model.predict(final_features)[0]

        # Convert prediction (numeric) to crop name
        crop_name = crop_dict.get(prediction, "Unknown Crop")

        return jsonify({"result": crop_name})
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
