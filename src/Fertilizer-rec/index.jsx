import React, { useState } from "react";

function FertilizerRec() {
  const [nitrogen, setNitrogen] = useState("");
  const [phosphorus, setPhosphorus] = useState("");
  const [potassium, setPotassium] = useState("");
  const [fertilizer, setFertilizer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setFertilizer("");
    setLoading(true);

    if (!nitrogen || !phosphorus || !potassium) {
      setError("Please enter values for all nutrients.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5003/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nitrogen: parseFloat(nitrogen),
          phosphorus: parseFloat(phosphorus),
          potassium: parseFloat(potassium),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch recommendation.");
      }

      const data = await response.json();
      console.log("API Response:", data);
      setFertilizer(data.recommended_fertilizer);
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nitrogen" className="block text-lg font-bold mt-7">
                Nitrogen (N) Value:
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
            </div>
            <div>
              <label htmlFor="phosphorus" className="block text-lg font-bold mt-7">
                Phosphorus (P) Value:
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
            </div>
            <div>
              <label htmlFor="potassium" className="block text-lg font-bold mt-7">
                Potassium (K) Value:
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
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white text-lg font-bold py-2 rounded mt-7"
              disabled={loading}
            >
              {loading ? "Processing..." : "Get Recommendation"}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="bg-red-600 text-white p-3 rounded mt-4 text-center">
              <p>{error}</p>
            </div>
          )}
        </div>

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
      </div>
    </div>
  );
}

export default FertilizerRec;

