import UsuarioFormulario from '../components/UsuarioFormulario'
import { crearUsuario } from '../services/usuarioService'

function AdminNuevoUsuarioView({ ejecutarUsuario }) {
  async function guardar(datos) {
    const usuario = await ejecutarUsuario((token) => crearUsuario(datos, token))
    return { usuario }
  }

  return <UsuarioFormulario onGuardar={guardar} />
}

export default AdminNuevoUsuarioView
