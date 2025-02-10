'''from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS  
import os
import json
import numpy as np
from tensorflow.keras.models import load_model
from PIL import Image
from werkzeug.utils import secure_filename

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the uploads folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load the trained model
model_path = os.path.join('trained_model', 'plant_disease_prediction_model.h5')
try:
    model = load_model(model_path)
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Load class indices with UTF-8 encoding
class_indices_path = os.path.join('trained_model', 'class_indices.json')
try:
    with open(class_indices_path, 'r', encoding='utf-8') as f:
        class_indices = json.load(f)
    print("Class indices loaded successfully!")
except Exception as e:
    print(f"Error loading class indices: {e}")
    class_indices = {}

# Preprocess the uploaded image
def load_and_preprocess_image(image_path, target_size=(224, 224)):
    try:
        img = Image.open(image_path).convert("RGB")  # Ensure RGB format
        img = img.resize(target_size)
        img_array = np.array(img)

        img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
        img_array = img_array.astype('float32') / 255.  # Normalize

        return img_array
    except Exception as e:
        print(f"Error in Image Processing: {e}")
        return None

# Predict disease
def predict_disease(image_path):
    try:
        print(f"Loading image from: {image_path}")
        preprocessed_img = load_and_preprocess_image(image_path)

        if preprocessed_img is None:
            return "Error in image processing"

        print("Image processed successfully, shape:", preprocessed_img.shape)

        print("Running Model Prediction...")
        predictions = model.predict(preprocessed_img)

        print("Raw Predictions:", predictions)

        predicted_class_index = np.argmax(predictions, axis=1)[0]
        print(f"Predicted Class Index: {predicted_class_index}")

        predicted_class_name = class_indices.get(str(predicted_class_index), "Unknown")

        # Handle unknown predictions
        if predicted_class_name == "Unknown":
            print("Warning: Class Index not found in JSON file!")
        
        # Sanitize the predicted class name for safe UTF-8 encoding
        predicted_class_name = str(predicted_class_name).encode('utf-8', 'ignore').decode('utf-8')

        return predicted_class_name
    except Exception as e:
        print(f"Prediction Error: {e}")
        return f"Error in prediction: {e}"

# Route for testing
@app.route('/')
def index():
    return 'Plant Disease Detection API is running'

# Route to handle image upload and prediction
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    # Secure the filename and save the image
    safe_filename = secure_filename(file.filename)
    img_path = os.path.join(app.config['UPLOAD_FOLDER'], safe_filename)
    file.save(img_path)

    # Predict disease
    prediction = predict_disease(img_path)

    return jsonify({'prediction': prediction, 'image_url': f'/uploads/{safe_filename}'})

# Route to serve uploaded images
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True, port=5002)
'''

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
import numpy as np
from tensorflow.keras.models import load_model
from PIL import Image
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load the trained model (only once at app start)
model_path = os.path.join('trained_model', 'plant_disease_prediction_model.h5')
try:
    model = load_model(model_path)
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Load class indices (only once at app start)
class_indices_path = os.path.join('trained_model', 'class_indices.json')
try:
    with open(class_indices_path, 'r', encoding='utf-8') as f:
        class_indices = json.load(f)
    print("Class indices loaded successfully!")
except Exception as e:
    print(f"Error loading class indices: {e}")
    class_indices = {}

# Preprocess the uploaded image
def load_and_preprocess_image(image_path, target_size=(224, 224)):
    try:
        img = Image.open(image_path).convert("RGB")  # Ensure RGB format
        img = img.resize(target_size)
        img_array = np.array(img)
        img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
        img_array = img_array.astype('float32') / 255.  # Normalize
        return img_array
    except Exception as e:
        print(f"Error in Image Processing: {e}")
        return None

# Predict disease
def predict_disease(image_path):
    try:
        preprocessed_img = load_and_preprocess_image(image_path)
        if preprocessed_img is None:
            return "Error in image processing"
        predictions = model.predict(preprocessed_img)
        predicted_class_index = np.argmax(predictions, axis=1)[0]
        predicted_class_name = class_indices.get(str(predicted_class_index), "Unknown")
        return predicted_class_name
    except Exception as e:
        return f"Error in prediction: {e}"

@app.route('/')
def index():
    return 'Plant Disease Detection API is running'

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    safe_filename = secure_filename(file.filename)
    img_path = os.path.join(app.config['UPLOAD_FOLDER'], safe_filename)
    file.save(img_path)

    prediction = predict_disease(img_path)
    return jsonify({'prediction': prediction, 'image_url': f'/uploads/{safe_filename}'})

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == "__main__":
    app.run(debug=False, port=5002, threaded=True)
