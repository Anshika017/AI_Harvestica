import React, { useState, useEffect, useRef } from "react";
import { Button } from "../button";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const clientId = import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID;

function Header() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <header className="fixed top-0 left-0 w-full bg-black shadow-md z-50">
        <div className="p-3 px-5 flex justify-between items-center">
          {/* Logo */}
          <img src="/logoo.jpg" className="w-[120px] h-[40px]" alt="Logo" />

          <div className="relative flex items-center">
            {/* Home Button */}
            <Button
              className="text-black bg-green-500 border-2 border-white py-2 px-6 rounded-full hover:bg-white hover:text-black mr-4"
              onClick={() => navigate("/")}
            >
              Home
            </Button>

            {user ? (
              <div className="relative" ref={menuRef}>
                {/* Profile Picture */}
                <img
                  src={user.picture}
                  alt="User Profile"
                  className="w-10 h-10 rounded-full cursor-pointer border-2 border-white"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  onError={(e) => (e.target.src = "/default_img.jpg")}
                />

                {/* Dropdown */}
                {menuOpen && (
                  <div className="absolute right-0 mt-2 bg-white shadow-md rounded-lg py-2 w-40 z-20">
                    <p className="text-center text-gray-800 font-semibold p-2">
                      {user.name}
                    </p>
                    <button
                      className="block w-full text-left px-4 py-2 bg-white text-red-400 font-semibold rounded-md border border-gray-300 hover:bg-gray-100 hover:text-black"
                      onClick={handleLogout}
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button
                className="text-black bg-green-500 border-2 border-white py-2 px-6 rounded-full hover:bg-white hover:text-black"
                onClick={() => navigate("/sign-in")}
              >
                Log In
              </Button>
            )}
          </div>
        </div>
      </header>
    </GoogleOAuthProvider>
  );
}

export default Header;
