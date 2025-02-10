import React, { useState } from 'react';

function FertilizerRec() {
  const [nitrogen, setNitrogen] = useState('');
  const [phosphorus, setPhosphorus] = useState('');
  const [potassium, setPotassium] = useState('');
  const [fertilizer, setFertilizer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setFertilizer('');
    setLoading(true);

    // Validate input
    if (!nitrogen || !phosphorus || !potassium) {
      setError('Please enter values for all nutrients.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5003/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nitrogen: parseFloat(nitrogen),
          phosphorus: parseFloat(phosphorus),
          potassium: parseFloat(potassium),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch recommendation.');
      }

      const data = await response.json();
      console.log('API Response:', data);
      setFertilizer(data.recommended_fertilizer);
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen text-white bg-cover bg-center"
      style={{
        backgroundImage: "url('background_har.jpg')", // Replace with your image URL
        backgroundAttachment: 'fixed', // Keeps the background fixed
      }}
    >
      <div className="relative z-10 p-14">
        {/* Title with inline styling */}
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.6)', // Black with transparency
            textAlign: 'center',
            padding: '1rem', // Adjust padding as needed
            marginBottom: '1.5rem',
            width:'600px',
            marginLeft:'275px',
            borderRadius: '10px'
          }}
        >
          Fertilizer Recommendation
        </h1>


        {/* Content with black transparent background */}
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)', // Black with transparency
            padding: '2rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: 'auto',
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
                className="w-full p-2 border border-white-900 rounded text-white"
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
                className="w-full p-2 border border-white-900 rounded text-white"
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
                className="w-full p-2 border border-white-900 rounded text-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white text-lg font-bold py-2 rounded mt-7"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Get Recommendation'}
            </button>
          </form>

          {/* Error Message with inline styling */}
          {error && (
            <div
              style={{
                backgroundColor: 'rgba(255, 0, 0, 0.7)', // Red with transparency
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center',
                marginTop: '1.5rem',
              }}
            >
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Fertilizer Recommendation with inline styling */}
        {fertilizer && (
          <div
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.6)', // Black with transparency
              padding: '1.5rem',
              borderRadius: '8px',
              marginTop: '2rem',
              maxWidth: '600px',
              margin: 'auto',
            }}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '1rem',
              }}
            >
              Recommended Fertilizer:
            </h2>
            <p
              style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: 'green',
              }}
            >
              {fertilizer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FertilizerRec;
