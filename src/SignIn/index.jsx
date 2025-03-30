import React, { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const navigate = useNavigate();
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      navigate("/plan-farm");
    }
  }, [navigate]);

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/background_har.jpg')" }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

      {/* Login Box */}
      <div className="relative z-10 bg-black bg-opacity-80 p-10 rounded-xl shadow-lg w-96 text-center">
        <h2 className="text-3xl font-bold mb-6 text-white">Sign In</h2>
        <p className="text-gray-300 mb-4">Access your Harvestica account</p>

        {/* Google Login Button */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(response) => {
              const decoded = jwtDecode(response.credential);
              console.log("Decoded User:", decoded);

              const userData = {
                name: decoded.name,
                email: decoded.email,
                picture: decoded.picture || "/default_img.jpg",
              };

              localStorage.setItem("user", JSON.stringify(userData));
              navigate("/plan-farm");
            }}
            onError={() => console.log("Login Failed")}
          />
        </div>

        <p className="mt-4 text-gray-400 text-sm">Sign in with Google to continue</p>

        {/* Terms & Conditions Trigger */}
        <div className="mt-6 text-gray-500 text-xs">
          By signing in, you agree to our{" "}
          <span
            className="underline cursor-pointer text-gray-400 hover:text-white"
            onClick={() => setShowTerms(true)}
          >
            Terms & Conditions
          </span>.
        </div>
      </div>

      {/* Full-page Terms & Conditions Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg w-4/5 md:w-1/2 lg:w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Terms & Conditions</h2>
            
            </div>
            <p className="text-sm text-gray-300">
              Welcome to Harvestica! By using our platform, you agree to the following terms:
            </p>
            <ul className="list-disc pl-4 mt-3 text-sm space-y-2 text-gray-400">
              <li>We collect minimal user data to enhance your experience.</li>
              <li>Your account activity is used for AI-driven recommendations.</li>
              <li>We do not store or share personal credentials.</li>
              <li>All AI suggestions should be cross-verified before use.</li>
              <li>Users must comply with fair usage policies.</li>
              <li>Harvestica reserves the right to update these terms at any time.</li>
            </ul>
            <button
              onClick={() => setShowTerms(false)}
              className="mt-6 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignIn;
