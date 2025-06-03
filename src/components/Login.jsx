import { useState, useEffect } from 'react';
import '../css/login.css'; // Asegúrate de que la ruta sea correcta
import { loginGoogle, loginUser, registerUser } from '../Firebase/auth'; // Asegúrate de que la ruta sea correcta
import React from 'react'; // React ya no es estrictamente necesario importar en cada archivo con las últimas versiones de React, pero no hace daño.

const Login = () => {
  const [isLogin, setIsLogin] = useState(true); // Estado para alternar entre login y registro
  const [formData, setFormData] = useState({ email: '', password: '', error: '' }); // Estado para los datos del formulario y errores
  const [loading, setLoading] = useState(true); // Estado para controlar la pantalla de carga

  // Efecto para limpiar el formulario cuando se cambia entre login/registro
  useEffect(() => {
    setFormData({ email: '', password: '', error: '' });
  }, [isLogin]);

  // Efecto para simular la precarga de la aplicación
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 segundos de precarga
    return () => clearTimeout(timer); // Limpia el temporizador si el componente se desmonta
  }, []);

  // Función para manejar el envío del formulario (login o registro)
  const handleSubmit = () => {
    if (isLogin) {
      console.log("Iniciando sesión...", formData);
      loginUser(formData, setFormData); // Llama a la función de Firebase para login
    } else {
      console.log("Registrando usuario...", formData);
      registerUser(formData, setFormData); // Llama a la función de Firebase para registro
    }
    // Limpia el mensaje de error después de un tiempo
    setTimeout(() => setFormData({ ...formData, error: '' }), 4000);
  };

  // Renderizado condicional: Muestra la pantalla de carga si 'loading' es true
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="background-circle"></div>
        <div className="spinner-wrapper">
          <div className="spinner-circle"></div>
        </div>
      </div>
    );
  }

  // Renderizado del formulario de login/registro si 'loading' es false
  return (
    <main>
      <section>
        <div className='form-header'>
          <div className="title-login">{isLogin ? 'Iniciar sesión' : 'Crear cuenta'}</div>
        </div>
        
       <div className='input-box'>
          <i className='bx bx-envelope icon-input'></i>
          <input
            type="email"
            placeholder='Correo electrónico'
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className='input-box'>
          <i className='bx bx-lock-alt icon-input'></i>
          <input
            type="password"
            placeholder='Contraseña'
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        {/* Muestra el mensaje de error si existe */}
        {formData.error && <span className="error">{formData.error}</span>}
        
        <button onClick={handleSubmit} className='sesion'>
          {isLogin ? 'Iniciar sesión' : 'Registrarse'}
        </button>

        <h3>ó</h3>

        <button onClick={loginGoogle} className='google'>
          {isLogin ? 'Iniciar sesión con Google' : 'Registrarse con Google'}
        </button>

        {/* Texto para alternar entre login y registro */}
        {isLogin ? (
          <h3>¿No tienes cuenta? <span onClick={() => setIsLogin(false)}>Crea una cuenta</span></h3>
        ) : (
          <h3>¿Ya tienes cuenta? <span onClick={() => setIsLogin(true)}>Inicia sesión</span></h3>
        )}
      </section>
    </main>
  );
};

export default Login;