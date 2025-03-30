import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from './components/ui/button'
import Hero from './components/ui/custom/Hero'

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    document.title = ' Harvestica'; // Change the title here
  }, []);

  return (
    <>
    {/*Hero */}
    <Hero/>
    </>
  )
}

export default App
