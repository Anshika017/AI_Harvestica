import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const BACKEND_STATIC_URL = "http://localhost:5000/static";

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
  const [submitted, setSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateInput(name, value);
  };

  const validateInput = (name, value) => {
    let errorMessage = "";

    switch (name) {
      case "Ph":
        if (value < 1 || value > 14) {
          errorMessage = "Ph value must be between 1 and 14.";
        }
        break;
      case "Nitrogen":
      case "Phosphorus":
      case "Potassium":
        if (value < 0 || value > 140) {
          errorMessage = `${name} should be between 0 and 140 kg/ha.`;
        }
        break;
      case "Temperature":
        if (value < -10 || value > 60) {
          errorMessage = "Temperature should be between -10°C and 60°C.";
        }
        break;
      case "Humidity":
        if (value < 0 || value > 100) {
          errorMessage = "Humidity should be between 0% and 100%.";
        }
        break;
      case "Rainfall":
        if (value < 0 || value > 500) {
          errorMessage = "Rainfall should be between 0 and 500 mm.";
        }
        break;
      default:
        break;
    }

    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  const validateInputs = () => {
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      validateInput(key, formData[key]);
      if (validationErrors[key]) {
        isValid = false;
      }
    });

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) {
      setResult("Please enter correct values for all fields.");
      return;
    }

    setSubmitted(true);
    setResult(null);

    try {
      const response = await fetch("/crop/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.error) {
        setResult("Error: " + data.error);
      } else {
        setResult(data.result);
      }
    } catch (error) {
      setResult("Server error! Please try again later.");
    }
  };

  const handleReset = () => {
    setFormData({
      Nitrogen: "",
      Phosphorus: "",
      Potassium: "",
      Temperature: "",
      Humidity: "",
      Ph: "",
      Rainfall: "",
    });
    setResult(null);
    setValidationErrors({});
    setSubmitted(false);
  };

  const styles = {
    pageContainer: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: `url(${BACKEND_STATIC_URL}/background_har.jpg) no-repeat center center/cover`,
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
    errorText: {
      color: "red",
      fontSize: "12px",
      marginTop: "5px",
    },
    button: {
      backgroundColor: "#28a745",
      border: "none",
      padding: "12px 20px",
      fontSize: "18px",
      color: "white",
      cursor: "pointer",
      borderRadius: "10px",
      margin: "20px auto 0",
      display: "block",
    },
    resultContainer: {
      textAlign: "center",
      marginTop: "20px",
      padding: "30px",
      borderRadius: "8px",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      color: "#fff",
    },
    cropImage: {
      width: "200px",
      height: "200px",
      borderRadius: "5px",
      margin: "20px auto",
      display: "block",
    },
    cropText: {
      textAlign: "center",
      fontWeight: "bold",
      fontSize: "25px",
    },
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.headingContainer}>
        <h1>🌾 Crop Recommendation System</h1>
      </div>

      {!submitted ? (
        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <div className="row">
              {["Nitrogen", "Phosphorus", "Potassium"].map((name) => (
                <div className="col-md-4" key={name}>
                  <label style={styles.label}>{name} (kg/ha)</label>
                  <input
                    type="number"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                  {validationErrors[name] && (
                    <div style={styles.errorText}>{validationErrors[name]}</div>
                  )}
                </div>
              ))}
            </div>

            <div className="row">
              {["Temperature", "Humidity"].map((name) => (
                <div className="col-md-6" key={name}>
                  <label style={styles.label}>
                    {name} {name === "Temperature" ? "(°C)" : "(%)"}
                  </label>
                  <input
                    type="number"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                  {validationErrors[name] && (
                    <div style={styles.errorText}>{validationErrors[name]}</div>
                  )}
                </div>
              ))}
            </div>

            <div className="row">
              {["Ph", "Rainfall"].map((name) => (
                <div className="col-md-6" key={name}>
                  <label style={styles.label}>{name}</label>
                  <input
                    type="number"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                  {validationErrors[name] && (
                    <div style={styles.errorText}>{validationErrors[name]}</div>
                  )}
                </div>
              ))}
            </div>

            <button type="submit" style={styles.button}>
              Recommend Crop
            </button>
          </form>
        </div>
      ) : (
        <div style={styles.resultContainer}>
          {result && (
            <>
              <h3>Recommended Crop:</h3>
              <img
                src={`${BACKEND_STATIC_URL}/crop_pic.jpg`}
                alt="Crop"
                style={styles.cropImage}
              />
              <div style={styles.cropText}>{result}</div>
              <button onClick={handleReset} style={styles.button}>
                Recommend Again
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CropRecommendation;
