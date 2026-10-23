import { Button } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import UsuarioFormulario from '../components/UsuarioFormulario'

function AdminEditarUsuarioView({ usuarios, actualizarUsuario }) {
  const { id } = useParams()
  const usuario = usuarios.find((item) => String(item.id) === id)

  if (!usuario) {
    return (
      <>
        <h1 className="mb-4">Usuario no encontrado</h1>
        <Button as={Link} role="link" to="/admin/usuarios" variant="outline-primary">Volver a Usuarios</Button>
      </>
    )
  }

  return <UsuarioFormulario key={usuario.id} usuario={usuario} onGuardar={(valores) => actualizarUsuario(usuario.id, valores)} />
}

export default AdminEditarUsuarioView
