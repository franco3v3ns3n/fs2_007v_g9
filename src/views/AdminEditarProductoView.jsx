import { Button } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import ProductoFormulario from '../components/ProductoFormulario'
import { useProductos } from '../context/ProductosContext'

function AdminEditarProductoView() {
  const { codigo } = useParams()
  const { productos, actualizarProducto } = useProductos()
  const producto = productos.find((item) => item.codigo === codigo)

  if (!producto) {
    return (
      <>
        <h1 className="mb-4">Producto no encontrado</h1>
        <Button as={Link} role="link" to="/admin/productos" variant="outline-primary">Volver a Productos</Button>
      </>
    )
  }

  return <ProductoFormulario key={codigo} producto={producto} onGuardar={(valores) => actualizarProducto(codigo, valores)} />
}

export default AdminEditarProductoView
