import ProductoFormulario from '../components/ProductoFormulario'
import { useProductos } from '../context/ProductosContext'

function AdminNuevoProductoView() {
  const { agregarProducto } = useProductos()
  return <ProductoFormulario onGuardar={agregarProducto} />
}

export default AdminNuevoProductoView
