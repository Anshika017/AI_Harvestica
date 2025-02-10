import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import PlanFarm from './plan-farm'
import Header from './components/ui/custom/Header'
import CropRecommed from './Crop-rec'
import PlantDisease from './Plant-Disease'
import FertilizerRec from './Fertilizer-rec'
import { GoogleOAuthProvider } from '@react-oauth/google'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Header />
        <App />
      </>
    )
  },
  {
    path: '/plan-farm',
    element: (
      <>
        <Header />
        <PlanFarm />
      </>
    )
  },
  {
    path: '/Crop-rec',
    element:(
      <>
        <Header />
        <CropRecommed />
      </>
    )
  },
  {
    path: '/Fertilizer-rec',
    element:(
      <>
        <Header />
        <FertilizerRec />
      </>
    )
  },
  {
    path: '/Plant-Disease',
    element:(
      <>
        <Header />
        <PlantDisease />
      </>
    )
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
    <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)

