import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { RouterProvider, createBrowserRouter, useNavigate } from 'react-router-dom';
import PlanFarm from './plan-farm';
import Header from './components/ui/custom/Header';
import CropRecommed from './Crop-rec';
import PlantDisease from './Plant-Disease';
import FertilizerRec from './Fertilizer-rec';
import SignIn from './SignIn';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Higher-Order Component to check authentication before accessing protected pages
const ProtectedRoute = ({ element }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/sign-in'); // Redirect to sign-in if not logged in
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  return isAuthenticated ? element : null;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Header />
        <App />
      </>
    ),
  },
  {
    path: '/sign-in',
    element: <SignIn />,
  },
  {
    path: '/plan-farm',
    element: (
      <>
        <Header />
        <ProtectedRoute element={<PlanFarm />} />
      </>
    ),
  },
  {
    path: '/Crop-rec',
    element: (
      <>
        <Header />
        <ProtectedRoute element={<CropRecommed />} />
      </>
    ),
  },
  {
    path: '/Fertilizer-rec',
    element: (
      <>
        <Header />
        <ProtectedRoute element={<FertilizerRec />} />
      </>
    ),
  },
  {
    path: '/Plant-Disease',
    element: (
      <>
        <Header />
        <ProtectedRoute element={<PlantDisease />} />
      </>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
