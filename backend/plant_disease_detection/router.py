import sys
import os
import json
import logging
import numpy as np
from flask import Blueprint, request, jsonify, send_from_directory
from tensorflow.keras.models import load_model
from PIL import Image
from werkzeug.utils import secure_filename

# Set UTF-8 encoding for stdout and stderr
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

# Ensure Python runs in UTF-8 mode
os.environ["PYTHONUTF8"] = "1"

# Define Blueprint
disease_bp = Blueprint('disease_bp', __name__)
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load the trained model
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'trained_model', 'plant_disease_prediction_model.h5')
model = None

logging.basicConfig(level=logging.INFO)

try:
    model = load_model(MODEL_PATH, compile=False)  # ✅ Added compile=False to avoid InputLayer error
    logging.info("Model loaded successfully!")
except Exception as e:
    logging.error(f"Error loading model: {e}")

# Load class indices
CLASS_INDICES_PATH = os.path.join(os.path.dirname(__file__), 'trained_model', 'class_indices.json')
class_indices = {}

try:
    with open(CLASS_INDICES_PATH, 'r', encoding='utf-8') as f:
        class_indices = json.load(f)
    logging.info("Class indices loaded successfully!")
except Exception as e:
    logging.error(f" Error loading class indices: {e}")

# Image Preprocessing
def load_and_preprocess_image(image_path, target_size=(224, 224)):
    try:
        img = Image.open(image_path).convert("RGB")
        img = img.resize(target_size)
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        return img_array
    except Exception as e:
        logging.error(f"Error in image processing: {e}")
        return None

# Prediction logic
def predict_disease(image_path):
    if model is None:
        return "Error: Model not loaded"

    try:
        preprocessed_img = load_and_preprocess_image(image_path)
        if preprocessed_img is None:
            return "Error in image processing"

        predictions = model.predict(preprocessed_img)
        predicted_class_index = np.argmax(predictions, axis=1)[0]
        predicted_class_name = class_indices.get(str(predicted_class_index), "Unknown")

        return predicted_class_name
    except Exception as e:
        logging.error(f"Error in prediction: {e}")
        return f"Error in prediction: {e}"

# Routes
@disease_bp.route('/')
def index():
    return jsonify({'message': 'Plant Disease Detection API is running!'})

@disease_bp.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    safe_filename = secure_filename(file.filename)
    img_path = os.path.join(UPLOAD_FOLDER, safe_filename)
    file.save(img_path)

    prediction = predict_disease(img_path)

    os.remove(img_path)

    return jsonify({'prediction': prediction})

@disease_bp.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)
