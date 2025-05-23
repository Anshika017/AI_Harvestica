from flask import Blueprint, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle
import os

# Define Blueprint
crop_bp = Blueprint('crop_bp', __name__)
CORS(crop_bp)  # Enable CORS for this blueprint

# Load trained models with error handling
try:
    base_path = os.path.dirname(__file__)
    model = pickle.load(open(os.path.join(base_path, "model.pkl"), "rb"))
    sc = pickle.load(open(os.path.join(base_path, "standardscaler.pkl"), "rb"))
    ms = pickle.load(open(os.path.join(base_path, "minmaxscaler.pkl"), "rb"))
    print("Crop model and scalers loaded successfully!")
except Exception as e:
    print(f" ERROR loading model/scalers: {str(e)}")
    exit()

# Crop dictionary
crop_dict = {
    1: "Rice", 2: "Maize", 3: "Jute", 4: "Cotton", 5: "Coconut", 6: "Papaya",
    7: "Orange", 8: "Apple", 9: "Muskmelon", 10: "Watermelon", 11: "Grapes",
    12: "Mango", 13: "Banana", 14: "Pomegranate", 15: "Lentil", 16: "Blackgram",
    17: "Mungbean", 18: "Mothbeans", 19: "Pigeonpeas", 20: "Kidneybeans",
    21: "Chickpea", 22: "Coffee"
}

@crop_bp.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Crop Recommendation API is running!"})

@crop_bp.route("/predict", methods=["POST"])
def predict_crop():
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

        crop_name = crop_dict.get(prediction, "Unknown Crop")

        return jsonify({"result": crop_name})
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500
