import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const CropRecommendation = () => {
  const [formData, setFormData] = useState({
    Nitrogen: "",
    Phosphorus: "",
    Potassium: "",
    Temperature: "",
    Humidity: "",
    Ph: "",
    Rainfall: "",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:5001/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.result);
      }
    } catch (error) {
      setError("Server error! Please try again later.");
    }
  };

  // Default crop image
  const defaultCropImage = "crop_pic.jpg";

  const styles = {
    pageContainer: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "url('background_har.jpg') no-repeat center center/cover",
      padding: "50px 20px",
    },
    headingContainer: {
      background: "rgba(0, 0, 0, 0.7)",
      padding: "15px 30px",
      borderRadius: "10px",
      color: "white",
      textAlign: "center",
      marginBottom: "20px",
    },
    formContainer: {
      background: "rgba(0, 0, 0, 0.8)",
      padding: "30px",
      borderRadius: "10px",
      color: "white",
      maxWidth: "700px",
      width: "100%",
    },
    label: {
      fontWeight: "bold",
      fontSize: "16px",
    },
    input: {
      width: "100%",
      padding: "10px",
      borderRadius: "5px",
      border: "none",
      marginBottom: "15px",
    },
    button: {
      backgroundColor: "#28a745",
      border: "none",
      padding: "12px 20px",
      fontSize: "18px",
      color: "white",
      cursor: "pointer",
      display: "block",
      //width: "100%",
      marginLeft:"200px",
      borderRadius:"10px",
      marginTop:"10px",
      marginBottom:"10px",
      transition: "0.3s ease-in-out",
    },
    buttonHover: {
      backgroundColor: "#218838",
    },
    resultContainer: {
      textAlign: "center",
      marginTop: "20px",
      padding: "15px",
      borderRadius: "8px",
      backgroundColor: "#ACE1AF",
      color: "#000",
    },
    cropImage: {
      width: "200px",
      height: "200px",
      borderRadius: "5px",
      marginTop: "10px",
      display: "block",
      marginLeft: "auto",
      marginRight: "auto",
    },
    cropText: {
      textAlign: "center",
      marginTop: "10px",
      fontWeight: "bold",
      fontSize: "25px",
    },
  };

  return (
    <div style={styles.pageContainer}>
      {/* Heading Container */}
      <div style={styles.headingContainer}>
        <h1>Crop Recommendation System 🌱</h1>
      </div>

      {/* Form Container */}
      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          {/* First Row: Nitrogen, Phosphorus, Potassium */}
          <div className="row">
            {["Nitrogen", "Phosphorus", "Potassium"].map((param) => (
              <div className="col-md-4" key={param}>
                <label style={styles.label}>{param}</label>
                <input
                  type="number"
                  name={param}
                  value={formData[param]}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
            ))}
          </div>

          {/* Second Row: Temperature, Humidity */}
          <div className="row">
            {["Temperature", "Humidity"].map((param) => (
              <div className="col-md-6" key={param}>
                <label style={styles.label}>{param}</label>
                <input
                  type="number"
                  name={param}
                  value={formData[param]}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
            ))}
          </div>

          {/* Third Row: Ph, Rainfall */}
          <div className="row">
            {["Ph", "Rainfall"].map((param) => (
              <div className="col-md-6" key={param}>
                <label style={styles.label}>{param}</label>
                <input
                  type="number"
                  name={param}
                  value={formData[param]}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
            ))}
          </div>

          <button type="submit" style={styles.button}>Get Recommendation</button>
        </form>

        {/* Display Result with Default Crop Image */}
        {result && (
          <div style={styles.resultContainer}>
            <h4 className="mb-7">Recommended Crop for cultivation is:</h4>
            <img src={defaultCropImage} alt={result} style={styles.cropImage} />
            <p style={styles.cropText}>{result}</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger mt-4 text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default CropRecommendation;
