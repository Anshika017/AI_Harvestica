import React, { useState } from "react";
import { Button } from "../button";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const clientId = import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID;

function Header() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // State for dropdown menu
  const navigate = useNavigate(); // Initialize the navigate function

  const handleLogout = () => {
    setUser(null); // Clear user state
    setMenuOpen(false); // Close the dropdown menu
    navigate("/"); // Navigate to the home screen
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="p-3 shadow-sm flex justify-between items-center px-5 bg-black relative z-10">
        {/* Logo */}
        <img src="/logo_harv.png" className="w-40 h-10" alt="Logo" />

        <div className="relative flex items-center">
          {/* Home Button */}
          <Button
            className="text-black bg-green-500 border-2 border-white py-2 px-6 rounded-full hover:bg-white hover:text-black mr-4"
            onClick={() => navigate("/")} // Navigate to home when clicked
          >
            Home
          </Button>

          {user ? (
            <>
              {/* Profile Picture (Click to toggle menu) */}
              <img
                src={user.picture || "default_img.jpg"}
                alt="User Profile"
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-white"
                onClick={() => setMenuOpen((prev) => !prev)} // Toggle menu state
                onError={(e) => (e.target.src = "default_img.jpg")} // Fallback on error
              />

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 bg-white shadow-md rounded-lg py-2 w-40 z-20">
                  <button
                    className="block w-full text-left px-4 py-2 text-black hover:bg-gray-200"
                    onClick={handleLogout} // Trigger logout and redirect to home
                  >
                    Log Out
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Sign In Button */}
              <Button
                className="text-black bg-green-500 border-2 border-white py-2 px-6 rounded-full hover:bg-white hover:text-black"
                onClick={() => setOpen(true)}
              >
                Sign In
              </Button>

              {/* Sign In Dialog Box */}
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Sign In</DialogTitle>
                  </DialogHeader>

                  {/* Google Login Button */}
                  <GoogleLogin
                    onSuccess={(response) => {
                      const decoded = jwtDecode(response.credential);
                      console.log("Decoded User:", decoded); // Debugging log
                      setUser(decoded);
                      setOpen(false);
                    }}
                    onError={() => console.log("Login Failed")}
                  />
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Header;
