import ProductoFormulario from '../components/ProductoFormulario'

function AdminNuevoProductoView({ agregarProducto }) {
  return <ProductoFormulario onGuardar={agregarProducto} />
}

export default AdminNuevoProductoView
