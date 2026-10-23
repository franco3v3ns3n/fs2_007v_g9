import { createContext, useContext, useEffect, useState } from 'react'
import { Alert } from 'react-bootstrap'
import { productosIniciales } from '../data/productosIniciales'
import { esCatalogoValido, normalizarCodigo, validarProducto } from '../utils/productos'

const ProductosContext = createContext(null)
const claveProductos = 'huertohogar-productos-v1'
const avisoSinAlmacenamiento = 'El almacenamiento local no está disponible. Los cambios de esta sesión no podrán conservarse después de recargar.'

function cargarCatalogo() {
  const iniciales = productosIniciales.map((producto) => ({ ...producto }))
  try {
    const guardado = localStorage.getItem(claveProductos)
    if (guardado === null) return { productos: iniciales, puedeGuardar: true, aviso: '' }
    const productos = JSON.parse(guardado)
    if (esCatalogoValido(productos)) return { productos, puedeGuardar: true, aviso: '' }
  } catch (error) {
    if (!(error instanceof SyntaxError)) {
      return { productos: iniciales, puedeGuardar: false, aviso: avisoSinAlmacenamiento }
    }
  }
  // Conserva intacto el contenido recuperable: esta sesión trabaja solo en memoria.
  return {
    productos: iniciales,
    puedeGuardar: false,
    aviso: 'Los datos guardados del catálogo no son válidos. Se muestra el catálogo inicial sin sobrescribirlos. Los cambios de esta sesión no se conservarán después de recargar.',
  }
}

export function ProductosProvider({ children }) {
  const [carga] = useState(cargarCatalogo)
  const [productos, setProductos] = useState(carga.productos)
  const [aviso, setAviso] = useState(carga.aviso)

  useEffect(() => {
    if (!carga.puedeGuardar) return
    try {
      const serializado = JSON.stringify(productos)
      if (localStorage.getItem(claveProductos) !== serializado) localStorage.setItem(claveProductos, serializado)
      setAviso('')
    } catch {
      setAviso(avisoSinAlmacenamiento)
    }
  }, [productos, carga.puedeGuardar])

  function guardarProducto(valores, codigoOriginal) {
    const errores = validarProducto(valores, productos, codigoOriginal)
    const anterior = productos.find((producto) => producto.codigo === codigoOriginal)
    if (codigoOriginal !== undefined && !anterior) errores.general = 'Producto no encontrado.'
    if (Object.keys(errores).length) return { errores }

    const origen = valores.origen.trim() || 'No especificado'
    const producto = {
      ...anterior,
      codigo: normalizarCodigo(valores.codigo),
      nombre: valores.nombre.trim(),
      categoria: valores.categoria,
      precio: Number(valores.precio),
      stock: Number(valores.stock),
      descripcion: valores.descripcion.trim(),
      unidadPrecio: valores.unidadPrecio.trim(),
      unidadStock: valores.unidadStock.trim(),
      origen,
      origenSimulado: anterior && origen === anterior.origen ? anterior.origenSimulado : true,
      imagen: anterior?.imagen ?? '/img/portada/portada-huertohogar.webp',
      imagenReferencial: anterior?.imagenReferencial ?? !anterior,
    }
    setProductos((actuales) => anterior
      ? actuales.map((item) => item.codigo === codigoOriginal ? producto : item)
      : [...actuales, producto])
    return { producto }
  }

  function agregarProducto(valores) {
    return guardarProducto(valores)
  }

  function actualizarProducto(codigoOriginal, valores) {
    return guardarProducto(valores, codigoOriginal)
  }

  function eliminarProducto(codigo) {
    setProductos((actuales) => actuales.filter((producto) => producto.codigo !== codigo))
  }

  return (
    <ProductosContext.Provider value={{ productos, agregarProducto, actualizarProducto, eliminarProducto }}>
      {aviso && <Alert variant="warning" role="status" className="m-3">{aviso}</Alert>}
      {children}
    </ProductosContext.Provider>
  )
}

export function useProductos() {
  const contexto = useContext(ProductosContext)
  if (!contexto) throw new Error('useProductos debe utilizarse dentro de ProductosProvider.')
  return contexto
}
