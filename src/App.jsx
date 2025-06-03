import React, { useState } from 'react';
import Home from './components/Home';
import Login from './components/Login';
import SplashScreen from './components/SplashScreen';
import SeguimientoLinea from './components/SeguimientoLinea'; 
import useUsuario from './hooks/useUsuario';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const usuario = useUsuario();

  if (showSplash) {
    return (
      <>
        <SeguimientoLinea /> 
        <SplashScreen onFinish={() => setShowSplash(false)} />
      </>
    );
  }

  return (
    <>
      <SeguimientoLinea /> 
      {usuario ? <Home /> : <Login />}
    </>
  );
}

export default App;
