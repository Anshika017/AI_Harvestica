import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function FeatureCard({ image, title, description, link, isHovered, onHover }) {
  return (
    <div
      className={`feature-card inline-block p-4 w-full max-w-xs transition-all duration-300 ease-in-out ${
        isHovered ? 'hover:w-full' : ''
      }`}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      style={{ cursor: 'pointer' }}
    >
      <Link to={link} className='no-underline'>
        <div
          className="feature-image bg-cover bg-center h-40 rounded-t-md"
          style={{ backgroundImage: `url(${image})` }}
        ></div>
        <div className="feature-content text-center bg-white p-4 rounded-b-md h-50">
          <h3 className="text-xl font-bold text-green-600">{title}</h3>
          <p className="text-gray-700 mt-2">{description}</p>
        </div>
      </Link>
    </div>
  );
}

function PlanFarm() {
  const [hovered, setHovered] = useState(false);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/sign-in'); // Redirect to sign-in if user is not logged in
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <div
      className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 min-h-screen bg-cover bg-center flex flex-col items-center justify-center px-5"
      style={{ backgroundImage: "url('/background_har.jpg')" }}
    >
      {/* User Profile Dropdown */}
      {user && (
        <div className="absolute top-5 right-5">
          <div className="relative">
            <img
              src={user.picture}
              alt="User Profile"
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-white"
              onClick={() => setMenuOpen((prev) => !prev)}
            />

            {menuOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-md rounded-lg py-2 w-40 z-20">
                <p className="text-center text-white-800 font-semibold p-2">{user.name}</p>
                
                <button
                  className="block w-full text-left px-4 py-2 bg-white text-white hover:bg-gray-200 rounded-md"
                  onClick={handleLogout}
                >
                  Log Out
                </button>

              </div>
            )}
          </div>
        </div>
      )}

      <h2 className="text-4xl font-extrabold text-white mb-10 text-center">Tell us your preference!</h2>

      <div className="flex flex-wrap justify-center w-full">
        {/* Crop Recommendation */}
        <FeatureCard
          image="/crop.jpg"
          title="CROP"
          description="Recommendation about the type of crops to be cultivated which is best suited for the respective conditions"
          link="/Crop-rec"
          isHovered={hovered}
          onHover={setHovered}
        />

        {/* Fertilizer Recommendation */}
        <FeatureCard
          image="/fertilizer.jpg"
          title="FERTILIZERS"
          description="Provide recommendations on fertilizers based on soil and crop data to enhance productivity."
          link="/Fertilizer-rec"
          isHovered={hovered}
          onHover={setHovered}
        />

        {/* Plant Disease Prediction */}
        <FeatureCard
          image="/plant.jpeg"
          title="CROP DISEASE"
          description="Predict crop diseases accurately using advanced AI models and suggest solutions to keep your plants healthy."
          link="/Plant-Disease"
          isHovered={hovered}
          onHover={setHovered}
        />
      </div>
    </div>
  );
}

export default PlanFarm;
