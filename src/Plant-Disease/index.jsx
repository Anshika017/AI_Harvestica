import React, { useState, useRef } from 'react'; 

import axios from 'axios';

const App = () => {
    const [file, setFile] = useState(null);
    const [prediction, setPrediction] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [solutions, setSolutions] = useState([]);
    const [predictedDisease, setPredictedDisease] = useState('');
    const [viewMode, setViewMode] = useState('prediction'); 

    const solutionsDict = {
       "Apple___Apple_scab": [
            "Remove infected leaves and fruit from the tree.",
            "Apply fungicides as a preventive measure during the growing season.",
            "Ensure proper air circulation around the plant.",
            "Avoid overhead watering to reduce moisture on leaves.",
            "Use resistant varieties of apple trees."
        ],
        "Apple___Black_rot": [
            "Prune and dispose of infected plant parts.",
            "Ensure good air circulation around the plant.",
            "Apply fungicides to reduce the spread of infection.",
            "Avoid overhead watering to keep leaves dry.",
            "Remove any fruit that shows signs of rot."
        ],
        "Apple___Cedar_apple_rust": [
            "Remove and dispose of infected leaves and fruit.",
            "Apply fungicides in early spring before symptoms appear.",
            "Plant resistant apple varieties.",
            "Avoid planting apples near juniper trees.",
            "Ensure proper drainage and air circulation."
        ],
        "Apple___healthy": [
            "Healthy! Keep up with regular care and watering."
        ],
        "Blueberry___healthy": [
            "Healthy! Continue maintaining proper soil acidity and watering."
        ],
        "Cherry_(including_sour)_Powdery_mildew": [
            "Prune infected leaves and fruit to reduce spore spread.",
            "Apply fungicides that are effective against powdery mildew.",
            "Avoid overcrowding the plants for better airflow.",
            "Water at the base of the plant to keep leaves dry.",
            "Use resistant varieties of cherry trees."
        ],
        "Cherry_(including_sour)_healthy": [
            "Healthy! Ensure regular watering and proper sun exposure."
        ],
        
        "Corn_(maize)___Cercospora_leaf_spot_Gray_leaf_spot": [
        "Remove and destroy infected plant debris.",
        "Apply fungicides to control the disease.",
        "Ensure proper spacing to improve airflow between plants.",
        "Avoid overhead watering to prevent leaf wetness.",
        "Plant resistant maize varieties."
    ],
        "Corn_(maize)Common_rust": [
            "Remove infected leaves from the plant.",
            "Apply fungicides to control the spread of rust.",
            "Ensure proper spacing and air circulation.",
            "Rotate crops to avoid rust buildup in the soil.",
            "Plant resistant maize varieties."
        ],
        "Corn_(maize)_Northern_Leaf_Blight": [
            "Remove and destroy infected leaves and plant debris.",
            "Apply fungicides to control the spread of the disease.",
            "Rotate crops to prevent reinfection the following season.",
            "Avoid planting maize too closely together.",
            "Use resistant varieties of maize."
        ],
        "Corn_(maize)_healthy": [
            "Healthy! Keep up with proper watering and nutrition."
        ],
        "Grape___Black_rot": [
            "Prune and remove infected plant parts.",
            "Apply fungicides during the growing season.",
            "Ensure proper drainage around the root system.",
            "Avoid overhead watering.",
            "Use resistant grape varieties."
        ],
        "Grape__Esca(Black_Measles)": [
            "Prune infected plant parts and dispose of them properly.",
            "Ensure good air circulation around the plant.",
            "Maintain proper watering techniques to avoid stress on the plant.",
            "Use resistant grape varieties when possible.",
            "Avoid planting susceptible grape varieties in areas prone to the disease."
        ],
        "Grape__Leaf_blight(Isariopsis_Leaf_Spot)": [
            "Remove and destroy infected leaves.",
            "Apply fungicides to control the spread of the disease.",
            "Ensure proper spacing and air circulation around plants.",
            "Use resistant grape varieties.",
            "Avoid overhead irrigation."
        ],
        "Grape___healthy": [
            "Healthy! Continue with proper care and maintenance."
        ],
        "Orange___Haunglongbing_(Citrus_greening)": [
            "Remove infected plants and parts.",
            "Use insecticides to control insect vectors like the Asian citrus psyllid.",
            "Avoid over-watering and ensure proper drainage.",
            "Use disease-free planting material.",
            "Maintain plant health by providing proper nutrition and care."
        ],
        "Peach___Bacterial_spot": [
            "Prune and remove infected plant parts.",
            "Apply copper-based bactericides during the growing season.",
            "Ensure proper spacing and air circulation around the plants.",
            "Avoid overhead watering.",
            "Plant resistant peach varieties."
        ],
        "Peach___healthy": [
            "Healthy! Keep your peach tree well-watered and well-nourished."
        ],
        "Pepper,bell__Bacterial_spot": [
            "Remove and dispose of infected plant parts.",
            "Apply copper-based bactericides to control bacterial spread.",
            "Avoid overhead watering and water at the base.",
            "Improve air circulation by spacing plants properly.",
            "Use resistant pepper varieties."
        ],
        "Pepper,bell__healthy": [
            "Healthy! Keep your bell peppers hydrated and well-fertilized."
        ],
        "Potato___Early_blight": [
            "Remove infected leaves and stems.",
            "Apply fungicides to control the spread of the disease.",
            "Avoid overhead watering to keep leaves dry.",
            "Practice crop rotation to avoid reinfection.",
            "Use resistant potato varieties."
        ],
        "Potato___Late_blight": [
            "Remove and destroy infected plant material.",
            "Apply fungicides regularly during the growing season.",
            "Plant resistant potato varieties.",
            "Ensure good air circulation around plants.",
            "Rotate crops each season to reduce risk."
        ],
        "Potato___healthy": [
            "Healthy! Ensure proper watering and soil conditions."
        ],
        "Raspberry___healthy": [
            "Healthy! Continue maintaining proper soil pH and watering."
        ],
        "Soybean___healthy": [
            "Healthy! Keep an eye on pest management and watering."
        ],
        "Squash___Powdery_mildew": [
            "Prune infected leaves to prevent further spread.",
            "Apply fungicides to control the disease.",
            "Space plants properly for better air circulation.",
            "Water at the base of the plant to avoid moisture on leaves.",
            "Use resistant squash varieties."
        ],
        "Strawberry___Leaf_scorch": [
            "Remove affected leaves and discard them.",
            "Ensure plants are not exposed to excessive sun or heat.",
            "Provide adequate water to the plants.",
            "Avoid planting too close together to allow airflow.",
            "Use mulch to protect the roots."
        ],
        "Strawberry___healthy": [
            "Healthy! Continue maintaining your strawberry plants' health with proper care."
        ],
        "Tomato___Bacterial_spot": [
            "Prune infected plant parts and dispose of them properly.",
            "Apply copper-based bactericides to control the spread of infection.",
            "Avoid overhead irrigation to keep leaves dry.",
            "Space plants to improve airflow.",
            "Plant resistant tomato varieties."
        ],
        "Tomato___Early_blight": [
            "Remove and dispose of infected leaves and fruit.",
            "Apply fungicides to control the disease.",
            "Space plants for proper airflow.",
            "Avoid wetting foliage with overhead irrigation.",
            "Practice crop rotation to prevent disease buildup."
        ],
        "Tomato___Late_blight": [
            "Remove and destroy infected plant material immediately.",
            "Apply fungicides to prevent further spread.",
            "Use resistant tomato varieties.",
            "Avoid overhead irrigation to keep the foliage dry.",
            "Practice good field hygiene to prevent reinfection."
        ],
        "Tomato___Leaf_Mold": [
            "Prune and dispose of infected leaves.",
            "Use fungicides to control the disease.",
            "Increase airflow around plants to reduce humidity.",
            "Avoid overhead watering.",
            "Plant resistant tomato varieties."
        ],
        "Tomato___Septoria_leaf_spot": [
            "Prune and destroy infected plant parts.",
            "Apply fungicides to control the spread of the disease.",
            "Ensure proper spacing for airflow.",
            "Avoid overhead irrigation to keep leaves dry.",
            "Practice crop rotation."
        ],
        "Tomato___Spider_mites_Two-spotted_spider_mite": [
            "Wash leaves with a strong stream of water to remove mites.",
            "Apply miticides to control the spread of mites.",
            "Improve plant health through proper watering and nutrition.",
            "Use insecticidal soap to control mite populations.",
            "Ensure proper spacing to reduce mite concentration."
        ],
        "Tomato___Target_Spot": [
            "Remove infected leaves and dispose of them.",
            "Apply fungicides regularly during the growing season.",
            "Ensure proper air circulation around plants.",
            "Avoid planting tomatoes too close together.",
            "Water at the base of the plant to prevent wet leaves."
        ],
        "Tomato___Tomato_Yellow_Leaf_Curl_Virus": [
            "Remove and destroy infected plants.",
            "Use insecticides to control the vector (whiteflies).",
            "Avoid planting tomatoes near infected crops.",
            "Ensure proper plant spacing for airflow.",
            "Use resistant tomato varieties."
        ],
        "Tomato___Tomato_mosaic_virus": [
            "Remove and destroy infected plants immediately.",
            "Avoid contact with infected plants to prevent the spread.",
            "Use disease-free seeds and planting material.",
            "Maintain good hygiene by cleaning tools regularly.",
            "Use resistant tomato varieties."
        ],
        "Tomato___healthy": [
            "Healthy! Continue maintaining proper care for your tomato plants."
        ]
    };

    const handleFileInputChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target.result);
        };
        reader.readAsDataURL(selectedFile);
        setPrediction('');
        setSolutions([]);
        setViewMode('prediction');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await axios.post('http://localhost:5002/predict', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const predicted = response.data.prediction;
                setPrediction(`Predicted Disease: ${predicted}`);
                setPredictedDisease(predicted);
                setViewMode('prediction');
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    const handleShowSolutions = () => {
        setSolutions(solutionsDict[predictedDisease] || []);
        setViewMode('solutions');
    };


const fileInputRef = useRef(null);  // Create a reference for the file input

const handleBackToPrediction = () => {
    setViewMode('prediction');           // Switch back to prediction view
    setPrediction('');                   // Clear the prediction text
    setSolutions([]);                    // Clear the solutions list
    setPredictedDisease('');             // Clear the predicted disease
    setImagePreview(null);               // Clear the image preview
    setFile(null);                       // Clear the file input state

    // Reset the file input field (this is key)
    if (fileInputRef.current) {
        fileInputRef.current.value = '';  // Reset the file input field
    }
};
    

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Plant Disease Detection</h1>

            <div style={styles.flexWrapper}>
                {/* Upload Section */}
                <div style={styles.uploadContainer}>
                    <form id="uploadForm" onSubmit={handleSubmit} style={styles.form}>
                        <input
                            type="file"
                            id="file"
                            onChange={handleFileInputChange}
                            style={styles.fileInput}
                        />
                        {imagePreview && <img src={imagePreview} alt="Preview" style={styles.imagePreview} />}
                        <button type="submit" style={styles.submitButton}>Submit</button>
                    </form>
                </div>

                {/* Prediction / Solutions */}
                {prediction && (
                    <div style={styles.predictionSolutionContainer}>
                        {/* Show Prediction */}
                        {viewMode === 'prediction' && (
                            <div style={styles.predictionContainer}>
                                <p style={styles.predictionText}>{prediction}</p>
                                <button onClick={handleShowSolutions} style={styles.showSolutionsButton}>
                                    Show Solutions
                                </button>
                            </div>
                        )}

                        {/* Show Solutions */}
                        {viewMode === 'solutions' && (
                            <div style={styles.solutionsContainer}>
                                {solutions.map((solution, index) => (
                                    <p key={index} style={styles.solution}>{solution}</p>
                                ))}
                                <button onClick={handleBackToPrediction} style={styles.showSolutionsButton}>
                                    Back to Prediction
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        backgroundImage: 'url("/background_har.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        padding: '20px',
        color: 'white',
        textAlign: 'center',
        paddingTop:'80px',
    },
    heading: {
        fontSize: '3rem',
        marginBottom: '30px',
        fontWeight: 'bold',
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: '10px',
        borderRadius: '10px',
        width:'800px',
        marginLeft:'200px',
    },
    flexWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: '10px',
        position: 'relative',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    uploadContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: '20px',
        borderRadius: '8px',
        flex: 1,
        maxWidth: '600px',
        marginRight: '0',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    fileInput: {
        marginBottom: '20px',
    },
    submitButton: {
        backgroundColor: '#4CAF50',
        color: 'black',
        padding: '10px 20px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.2rem',
    },
    imagePreview: {
        maxWidth: '250px',
        marginTop: '20px',
    },
    predictionSolutionContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: '20px',
        borderRadius: '8px',
        flex: 1,
        maxWidth: '600px',
        marginLeft: '0',
        overflow: 'hidden',
    },
    predictionContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    predictionText: {
        fontSize: '1.3rem',
        marginBottom: '20px',
    },
    showSolutionsButton: {
        backgroundColor: '#f4c542',
        color: 'black',
        padding: '10px 20px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.2rem',
    },
    solutionsContainer: {
        marginTop: '20px',
    },
    solution: {
        fontSize: '1.2rem',
        lineHeight: '1.6',
    },
};

export default App;


