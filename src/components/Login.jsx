import { useState,useEffect } from 'react'
import '../css/login.css'
import {loginGoogle, loginUser, registerUser} from '../Firebase/auth'
import React from 'react'

const Login = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({email:'',password:'', error:''})
  useEffect(() => {
    setFormData({ email: '', password: '', error: '' });
  }, [isLogin]);

  const handleSubmit = () => {
    if (isLogin){
      console.log("Iniciando sesion...", formData)
      loginUser(formData, setFormData)

    } else{
      console.log("Registrando usuario...", formData)
      registerUser(formData, setFormData)

    }

    setTimeout(()=> setFormData({...formData, error:''}),4000)
  }
  return (
    <main>
      <section>
          <div className='form-header'>
            <div class="title-login">{ isLogin  ? 'Iniciar sesión' : 'Crear cuenta'}</div>
          </div>
          <div className='input-box'>
            <input type="email" placeholder='Correo electronico' value={formData.email} onChange={(e)=> setFormData({...formData, email: e.target.value})} />
            <i class='bx bx-lock-alt icon'></i>
          </div>
          <div className='input-box'>
          <input type="password" placeholder='Contraseña' value={formData.password} onChange={(e)=> setFormData({...formData, password: e.target.value})}/>
          <i class='bx bx-lock-alt icon'></i>
          </div>
          <span className="error">{formData.error}</span>
          <button onClick={handleSubmit} className='sesion'>{ isLogin  ? 'Iniciar sesión' : 'Registrarse'}</button>
          <h3>ó</h3>
          <button onClick={loginGoogle} className='google'>{isLogin ? 'Iniciar sesión con Google' : 'Registrarse con Google'} </button>
          {
            isLogin
            ?<h3>¿No tienes cuenta? <span onClick={()=>setIsLogin(!isLogin)}>Crea una cuenta</span></h3>
            :<h3>¿Ya tienes cuenta? <span onClick={()=>setIsLogin(!isLogin)}>Inicia sesión</span></h3>
          }
        </section>

    </main>
  )
}

export default Login
