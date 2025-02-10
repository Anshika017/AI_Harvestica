import React, { useState } from 'react';
import Header from './Header';
import Hero from './Hero';

function App() {
  const [user, setUser] = useState(null); // Store user info

  return (
    <div>
      <Header user={user} setUser={setUser} />
      <Hero user={user} setUser={setUser} />
    </div>
  );
}

export default App;
