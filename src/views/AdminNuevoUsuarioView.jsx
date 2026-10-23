import UsuarioFormulario from '../components/UsuarioFormulario'

function AdminNuevoUsuarioView({ agregarUsuario }) {
  return <UsuarioFormulario onGuardar={agregarUsuario} />
}

export default AdminNuevoUsuarioView
