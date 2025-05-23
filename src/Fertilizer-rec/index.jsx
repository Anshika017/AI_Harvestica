import React, { useState } from "react";

function FertilizerRec() {
  const [nitrogen, setNitrogen] = useState("");
  const [phosphorus, setPhosphorus] = useState("");
  const [potassium, setPotassium] = useState("");
  const [fertilizer, setFertilizer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRecommendation, setShowRecommendation] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setFertilizer("");
    setLoading(true);

    const n = parseFloat(nitrogen);
    const p = parseFloat(phosphorus);
    const k = parseFloat(potassium);

    if (isNaN(n) || isNaN(p) || isNaN(k)) {
      setError("Please enter values for all nutrients.");
      setLoading(false);
      return;
    }

    // Range check: all between 0 and 140
    if (n < 0 || n > 140 || p < 0 || p > 140 || k < 0 || k > 140) {
      setError(
        "Please enter NPK values between 0 and 140 kg/ha."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/fertilizer/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nitrogen: n, phosphorus: p, potassium: k }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch recommendation.");
      }

      const data = await response.json();
      console.log("API Response:", data);
      setFertilizer(data.recommended_fertilizer);
      setShowRecommendation(true); // Show recommendation after it's fetched
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const isOutOfRange = (value) => value < 0 || value > 140;

  const handleRecommendAgain = () => {
    setShowRecommendation(false);
    setNitrogen("");
    setPhosphorus("");
    setPotassium("");
    setFertilizer("");
  };

  return (
    <div
      className="min-h-screen text-white bg-cover bg-center relative"
      style={{
        backgroundImage: "url('background_har.jpg')", // Replace with your image URL
        backgroundAttachment: "scroll", // Changed from fixed to scroll
        zIndex: 1, // Lowered to prevent blocking other elements
      }}
    >
      <div className="relative z-10 p-14">
        {/* Title */}
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            textAlign: "center",
            padding: "1rem",
            marginBottom: "1.5rem",
            width: "600px",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: "10px",
            marginTop:'50px',
            paddingTop:'10px',
          }}
        >
          Fertilizer Recommendation
        </h1>

        {/* Content */}
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            padding: "2rem",
            borderRadius: "8px",
            marginBottom: "2rem",
            maxWidth: "600px",
            margin: "auto",
          }}
        >
          {!showRecommendation ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="nitrogen" className="block text-lg font-bold mt-7">
                  Nitrogen (N) Value (kg/ha):
                </label>
                <input
                  type="number"
                  id="nitrogen"
                  name="nitrogen"
                  value={nitrogen}
                  onChange={(e) => setNitrogen(e.target.value)}
                  className="w-full p-2 border border-white-900 rounded text-white bg-transparent"
                  required
                />
                {isOutOfRange(nitrogen) && nitrogen && (
                  <p className="text-red-500 text-sm mt-2">Value must be between 0 and 140 kg/ha</p>
                )}
              </div>
              <div>
                <label htmlFor="phosphorus" className="block text-lg font-bold mt-7">
                  Phosphorus (P) Value (kg/ha):
                </label>
                <input
                  type="number"
                  id="phosphorus"
                  name="phosphorus"
                  value={phosphorus}
                  onChange={(e) => setPhosphorus(e.target.value)}
                  className="w-full p-2 border border-white-900 rounded text-white bg-transparent"
                  required
                />
                {isOutOfRange(phosphorus) && phosphorus && (
                  <p className="text-red-500 text-sm mt-2">Value must be between 0 and 140 kg/ha</p>
                )}
              </div>
              <div>
                <label htmlFor="potassium" className="block text-lg font-bold mt-7">
                  Potassium (K) Value (kg/ha):
                </label>
                <input
                  type="number"
                  id="potassium"
                  name="potassium"
                  value={potassium}
                  onChange={(e) => setPotassium(e.target.value)}
                  className="w-full p-2 border border-white-900 rounded text-white bg-transparent"
                  required
                />
                {isOutOfRange(potassium) && potassium && (
                  <p className="text-red-500 text-sm mt-2">Value must be between 0 and 140 kg/ha</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white text-lg font-bold py-2 rounded mt-7"
                disabled={loading}
              >
                {loading ? "Processing..." : "Get Recommendation"}
              </button>
            </form>
          ) : (
            <div>
              {/* Fertilizer Recommendation */}
              {fertilizer && (
                <div
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    padding: "1.5rem",
                    borderRadius: "8px",
                    marginTop: "2rem",
                    maxWidth: "600px",
                    margin: "auto",
                  }}
                >
                  <h2 className="text-xl font-bold text-white mb-2">
                    Recommended Fertilizer:
                  </h2>
                  <p className="text-lg font-bold text-green-400">{fertilizer}</p>
                </div>
              )}

              {/* Recommend Again Button */}
              <div className="mt-4 text-center">
                <button
                  onClick={handleRecommendAgain}
                  className="w-full bg-green-600 text-white text-lg font-bold py-2 rounded mt-7"
                >
                  Recommend Again
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-600 text-white p-3 rounded mt-4 text-center">
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FertilizerRec;
