import { useEffect, useState } from 'react'
import { Alert, Button, Modal, Table } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'

function AdminProductosView({ productos, eliminarProducto }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [mensaje, setMensaje] = useState(location.state?.mensaje ?? '')
  const [seleccionado, setSeleccionado] = useState(null)

  useEffect(() => {
    if (!location.state?.mensaje) return
    const { mensaje: confirmacion, ...estado } = location.state
    setMensaje(confirmacion)
    navigate({ pathname: location.pathname, search: location.search, hash: location.hash }, {
      replace: true,
      state: estado,
    })
  }, [location, navigate])

  function confirmarEliminacion() {
    eliminarProducto(seleccionado.codigo)
    setMensaje(`Producto ${seleccionado.codigo} eliminado del catálogo.`)
    setSeleccionado(null)
  }

  return (
    <>
      <section className="mb-4">
        <h1>Administración de productos</h1>
        <p>En esta sección se muestra el catálogo administrado de HuertoHogar.</p>
        <Button as={Link} role="link" to="/admin/productos/nuevo">Nuevo producto</Button>
      </section>
      {mensaje && <Alert variant="success" role="status">{mensaje}</Alert>}
      <section className="mb-4">
        <h2>Listado de productos</h2>
        <p className="small text-body-secondary">Puedes editar o eliminar cualquiera de los productos. Los cambios se conservan localmente en este navegador, si el almacenamiento está disponible.</p>
        {productos.length === 0 ? <p>No hay productos en el catálogo.</p> : (
          <div className="table-responsive border rounded" role="region" aria-label="Listado de productos" tabIndex={0}>
            <Table striped hover className="align-middle mb-0">
              <thead>
                <tr>{['Código', 'Nombre', 'Categoría', 'Precio', 'Stock', 'Acción'].map((columna) => <th key={columna} scope="col" className="text-nowrap">{columna}</th>)}</tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.codigo}>
                    <td className="text-nowrap">{producto.codigo}</td>
                    <td className="text-nowrap">{producto.nombre}</td>
                    <td className="text-nowrap">{producto.categoria}</td>
                    <td className="text-nowrap">${producto.precio.toLocaleString('es-CL')} por {producto.unidadPrecio}</td>
                    <td className="text-nowrap">{producto.stock} {producto.unidadStock}</td>
                    <td className="text-nowrap">
                      <Button as={Link} role="link" to={`/admin/productos/${producto.codigo}/editar`} variant="outline-primary" size="sm">Editar</Button>{' '}
                      <Button variant="outline-danger" size="sm" onClick={() => setSeleccionado(producto)}>Eliminar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </section>
      <Modal show={Boolean(seleccionado)} onHide={() => setSeleccionado(null)} centered aria-labelledby="tituloEliminarProducto">
        <Modal.Header closeButton closeLabel="Cerrar">
          <Modal.Title id="tituloEliminarProducto">Eliminar producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Quieres eliminar {seleccionado?.nombre} ({seleccionado?.codigo}) del catálogo? Esta acción no se puede deshacer.</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setSeleccionado(null)}>Cancelar</Button>
          <Button variant="danger" onClick={confirmarEliminacion}>Eliminar producto</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AdminProductosView
