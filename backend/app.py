from flask import Flask, jsonify
from flask_cors import CORS

# Import routers (assuming each has a router.py with blueprint named properly)
from crop_recommendation.router import crop_bp
from fertilizer_recommendation.router import fertilizer_bp
from plant_disease_detection.router import disease_bp

app = Flask(__name__)
CORS(app)

# Register Blueprints
app.register_blueprint(crop_bp, url_prefix="/crop")
app.register_blueprint(fertilizer_bp, url_prefix="/fertilizer")
app.register_blueprint(disease_bp, url_prefix="/plant")

@app.route('/')
def index():
    return jsonify({
        "message": "AI Harvestica Backend is running!",
        "routes": {
            "/crop/predict": "Crop Recommendation",
            "/fertilizer/api/recommend": "Fertilizer Recommendation",
            "/plant/predict": "Plant Disease Detection"
        }
    })

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
