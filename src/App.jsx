import Home from './components/Home'
import Login from './components/Login'
import useUsuario from './hooks/useUsuario'

function App() {
  const usuario= useUsuario()
  return usuario ? <Home/> : <Login/>
}

export default App
