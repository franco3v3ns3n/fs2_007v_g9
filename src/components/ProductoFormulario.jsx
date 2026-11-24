import { useEffect, useRef, useState } from 'react'
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import CampoFormulario from './CampoFormulario'
import { categoriasProducto } from '../utils/productos'
import { getErrorMessage } from '../utils/getErrorMessage'

function ProductoFormulario({ producto, onGuardar }) {
  const editar = Boolean(producto)
  const navigate = useNavigate()
  const [valores, setValores] = useState(() => ({
    codigo: producto?.codigo ?? '',
    nombre: producto?.nombre ?? '',
    categoria: producto?.categoria ?? '',
    precio: producto?.precio ?? '',
    stock: producto?.stock ?? '',
    descripcion: producto?.descripcion ?? '',
    unidadPrecio: producto?.unidadPrecio ?? 'kilo',
    unidadStock: producto?.unidadStock ?? 'kilos',
    origen: producto?.origen ?? '',
  }))
  const [errores, setErrores] = useState({})
  const [guardando, setGuardando] = useState(false)
  const envioActual = useRef(null)

  useEffect(() => () => { envioActual.current = null }, [])

  function cambiar(event) {
    const { name, value } = event.target
    setValores({ ...valores, [name]: value })
    setErrores({ ...errores, [name]: '', general: '' })
  }

  async function enviar(event) {
    event.preventDefault()
    if (envioActual.current) return
    const envio = {}
    envioActual.current = envio
    setGuardando(true)
    setErrores({})
    try {
      const resultado = await onGuardar(valores)
      if (envioActual.current !== envio) return
      if (resultado.errores) {
        setErrores(resultado.errores)
        return
      }
      navigate('/admin/productos', {
        replace: true,
        state: { mensaje: `Producto ${resultado.producto.codigo} ${editar ? 'actualizado' : 'agregado'} correctamente al catálogo.` },
      })
    } catch (error) {
      if (envioActual.current === envio) setErrores({ general: getErrorMessage(error, 'No se pudo guardar el producto') })
    } finally {
      if (envioActual.current === envio) {
        envioActual.current = null
        setGuardando(false)
      }
    }
  }

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={10} lg={8} xl={6}>
        <Card as="section" className="shadow-sm">
          <Card.Body className="p-4">
            <h1 className="h2 mb-3">{editar ? 'Editar producto' : 'Nuevo producto'}</h1>
            <p>{editar
              ? 'Revisa los datos del producto representativo del prototipo administrativo.'
              : 'Completa los datos para representar un nuevo producto en el prototipo administrativo.'}</p>
            <Form noValidate className="mt-4" onSubmit={enviar}>
              <CampoFormulario id="codigoProducto" nombre="codigo" etiqueta="Código:" valor={valores.codigo} onChange={cambiar} error={errores.codigo} />
              <CampoFormulario id="nombreProducto" nombre="nombre" etiqueta="Nombre:" valor={valores.nombre} onChange={cambiar} error={errores.nombre} />
              <Form.Group className="mb-3">
                <Form.Label htmlFor="categoriaProducto">Categoría:</Form.Label>
                <Form.Select id="categoriaProducto" name="categoria" value={valores.categoria} onChange={cambiar}
                  required aria-invalid={Boolean(errores.categoria)} aria-describedby="error-categoriaProducto">
                  <option value="">Selecciona una categoría</option>
                  {categoriasProducto.map((categoria) => <option key={categoria} value={categoria}>{categoria}</option>)}
                </Form.Select>
                <small id="error-categoriaProducto" className="text-danger d-block mt-1">{errores.categoria}</small>
              </Form.Group>
              <CampoFormulario id="precioProducto" nombre="precio" etiqueta="Precio:" tipo="number" min={1} step={1} valor={valores.precio} onChange={cambiar} error={errores.precio} />
              <CampoFormulario id="stockProducto" nombre="stock" etiqueta="Stock:" tipo="number" min={0} step={1} valor={valores.stock} onChange={cambiar} error={errores.stock} />
              <CampoFormulario id="descripcionProducto" nombre="descripcion" etiqueta="Descripción:" filas={3} valor={valores.descripcion} onChange={cambiar} error={errores.descripcion} />
              <fieldset className="mt-4">
                <legend className="h5">Información complementaria</legend>
                <CampoFormulario id="unidadPrecioProducto" nombre="unidadPrecio" etiqueta="Unidad de precio:" valor={valores.unidadPrecio} onChange={cambiar} error={errores.unidadPrecio} />
                <CampoFormulario id="unidadStockProducto" nombre="unidadStock" etiqueta="Unidad de stock:" valor={valores.unidadStock} onChange={cambiar} error={errores.unidadStock} />
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="origenProducto">Origen (opcional):</Form.Label>
                  <Form.Control id="origenProducto" name="origen" value={valores.origen} onChange={cambiar} />
                  <Form.Text>Los orígenes nuevos o modificados son referenciales para el prototipo.</Form.Text>
                </Form.Group>
              </fieldset>
              {errores.general && <Alert variant="danger" role="alert">{errores.general}</Alert>}
              <Button type="submit" disabled={guardando}>{guardando ? 'Guardando...' : editar ? 'Guardar cambios' : 'Guardar producto'}</Button>
            </Form>
            <p className="mt-4"><Button as={Link} role="link" to="/admin/productos" variant="outline-secondary">Volver a Productos</Button></p>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default ProductoFormulario
