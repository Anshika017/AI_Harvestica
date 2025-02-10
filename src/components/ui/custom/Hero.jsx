import React from 'react'
import { Button } from '../button'
import { useNavigate } from 'react-router-dom'

function Hero() {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div
      className='flex flex-col items-center justify-center gap-6 bg-cover bg-center h-screen relative'
      style={{ backgroundImage: 'url(/background_har.jpg)' }}>

      
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

      <h2 className='font-extrabold text-[50px] text-white text-center mx-4 z-10 mt-[-100px]'>
        <span className='ml-1'>Harvestica:</span><br /> Better Crops, Better Yields
      </h2>

      <p className='text-xl text-white text-center z-10 -mt-4'>
        AI-powered crop recommendations, personalized fertilizer guidance, and plant disease solutions all in one place.
      </p>

      <Button
        onClick={() => navigate('/plan-farm')}
        className="bg-black text-white py-2 px-6 rounded-full border-2 border-white hover:bg-white hover:text-black z-10 mt-10"
      >
        <span className='text-xl'> Get Started </span>
      </Button>
    </div>
  )
}

export default Hero






