import { useEffect, useState } from 'react'
import { Alert } from 'react-bootstrap'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { productosIniciales } from './data/productosIniciales'
import { esCatalogoValido, normalizarCodigo, validarProducto } from './utils/productos'
import { usuariosIniciales } from './data/usuariosIniciales'
import { esConjuntoUsuariosValido, generarIdUsuario, normalizarCorreo, validarUsuario } from './utils/usuarios'
import { ajustarCarrito, esCarritoValido, maximoComprable } from './utils/carrito'
import { autenticar, cargarSesion, guardarSesion } from './utils/sesion'
import CarritoView from './views/CarritoView'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'
import AdminInicioView from './views/AdminInicioView'
import AdminProductosView from './views/AdminProductosView'
import AdminNuevoProductoView from './views/AdminNuevoProductoView'
import AdminEditarProductoView from './views/AdminEditarProductoView'
import AdminUsuariosView from './views/AdminUsuariosView'
import AdminNuevoUsuarioView from './views/AdminNuevoUsuarioView'
import AdminEditarUsuarioView from './views/AdminEditarUsuarioView'
import InicioView from './views/InicioView'
import ProductosView from './views/ProductosView'
import DetalleProductoView from './views/DetalleProductoView'
import NosotrosView from './views/NosotrosView'
import BlogView from './views/BlogView'
import DetalleBlogView from './views/DetalleBlogView'
import ContactoView from './views/ContactoView'
import LoginView from './views/LoginView'
import RegistroView from './views/RegistroView'

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

const claveUsuarios = 'huertohogar-usuarios-v1'
const passwordTemporalUsuarios = 'Temporal2'
const avisoSinAlmacenamientoUsuarios = 'El almacenamiento local de usuarios no está disponible. Los cambios de esta sesión no podrán conservarse después de recargar.'

function cargarUsuarios() {
  const iniciales = usuariosIniciales.map((usuario) => ({ ...usuario }))
  try {
    const guardado = localStorage.getItem(claveUsuarios)
    if (guardado === null) return { usuarios: iniciales, puedeGuardar: true, aviso: '' }
    const usuarios = JSON.parse(guardado)
    if (esConjuntoUsuariosValido(usuarios)) {
      const usuariosMigrados = usuarios.map((usuario) => Object.hasOwn(usuario, 'password')
        ? usuario
        : { ...usuario, password: passwordTemporalUsuarios })
      return { usuarios: usuariosMigrados, puedeGuardar: true, aviso: '' }
    }
  } catch (error) {
    if (!(error instanceof SyntaxError)) {
      return { usuarios: iniciales, puedeGuardar: false, aviso: avisoSinAlmacenamientoUsuarios }
    }
  }
  return {
    usuarios: iniciales,
    puedeGuardar: false,
    aviso: 'Los datos guardados de usuarios no son válidos. Se muestran los registros iniciales sin sobrescribirlos. Los cambios de esta sesión no se conservarán después de recargar.',
  }
}

const claveCarrito = 'huertohogar-carrito-v1'
const avisoSinAlmacenamientoCarrito = 'El almacenamiento local del carrito no está disponible. Los cambios de esta sesión no podrán conservarse después de recargar.'

function cargarCarrito() {
  try {
    const guardado = localStorage.getItem(claveCarrito)
    if (guardado === null) return { carrito: [], puedeGuardar: true, aviso: '' }
    const carrito = JSON.parse(guardado)
    if (esCarritoValido(carrito)) return { carrito, puedeGuardar: true, aviso: '' }
  } catch (error) {
    if (!(error instanceof SyntaxError)) {
      return { carrito: [], puedeGuardar: false, aviso: avisoSinAlmacenamientoCarrito }
    }
  }
  return {
    carrito: [],
    puedeGuardar: false,
    aviso: 'Los datos guardados del carrito no son válidos. Se utiliza un carrito vacío sin sobrescribirlos. Los cambios de esta sesión no se conservarán después de recargar.',
  }
}

function App() {
  const ubicacion = useLocation()
  const navegar = useNavigate()
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

  const [cargaUsuarios] = useState(cargarUsuarios)
  const [usuarios, setUsuarios] = useState(cargaUsuarios.usuarios)
  const [avisoUsuarios, setAvisoUsuarios] = useState(cargaUsuarios.aviso)
  const [sesion, setSesion] = useState(() => cargarSesion(cargaUsuarios.usuarios))
  const clienteSesion = sesion?.tipo === 'cliente' ? usuarios.find((usuario) => usuario.id === sesion.id) : null
  const nombreSesion = clienteSesion ? `Hola, ${clienteSesion.nombre}` : sesion?.tipo === 'administrador' ? 'Administrador' : ''

  useEffect(() => {
    guardarSesion(sesion)
  }, [sesion])

  function iniciarSesion(tipo, valores) {
    const nuevaSesion = autenticar(tipo, valores, usuarios)
    if (!nuevaSesion) return false
    setSesion(nuevaSesion)
    return true
  }

  function cerrarSesion() {
    setSesion(null)
    navegar('/', { replace: true })
  }

  useEffect(() => {
    if (!cargaUsuarios.puedeGuardar) return
    try {
      const serializado = JSON.stringify(usuarios)
      if (localStorage.getItem(claveUsuarios) !== serializado) localStorage.setItem(claveUsuarios, serializado)
      setAvisoUsuarios('')
    } catch {
      setAvisoUsuarios(avisoSinAlmacenamientoUsuarios)
    }
  }, [usuarios, cargaUsuarios.puedeGuardar])

  function guardarUsuario(valores, { idOriginal, registroPublico = false } = {}) {
    const errores = validarUsuario(valores, usuarios, { idOriginal, registroPublico })
    const anterior = usuarios.find((usuario) => usuario.id === idOriginal)
    if (idOriginal !== undefined && !anterior) errores.general = 'Usuario no encontrado.'
    if (Object.keys(errores).length) return { errores }

    const usuario = {
      id: anterior?.id ?? generarIdUsuario(usuarios),
      nombre: valores.nombre.trim(),
      apellido: valores.apellido.trim(),
      correo: normalizarCorreo(valores.correo),
      telefono: valores.telefono.trim(),
      direccion: registroPublico ? '' : valores.direccion.trim(),
      password: anterior ? anterior.password : valores.password,
    }
    setUsuarios((actuales) => anterior
      ? actuales.map((item) => item.id === idOriginal ? usuario : item)
      : [...actuales, usuario])
    return { usuario }
  }

  function agregarUsuario(valores) {
    return guardarUsuario(valores)
  }

  function actualizarUsuario(idOriginal, valores) {
    return guardarUsuario(valores, { idOriginal })
  }

  function eliminarUsuario(id) {
    setUsuarios((actuales) => actuales.filter((usuario) => usuario.id !== id))
    setSesion((actual) => actual?.tipo === 'cliente' && actual.id === id ? null : actual)
  }

  const [cargaCarrito] = useState(cargarCarrito)
  const [carrito, setCarrito] = useState(cargaCarrito.carrito)
  const [avisoCarrito, setAvisoCarrito] = useState(cargaCarrito.aviso)
  const [mensajeCarrito, setMensajeCarrito] = useState(null)
  const carritoDisponible = ajustarCarrito(carrito, productos)
  const cantidadCarrito = carritoDisponible.reduce((suma, articulo) => suma + articulo.cantidad, 0)

  useEffect(() => {
    setMensajeCarrito(null)
  }, [ubicacion])

  useEffect(() => {
    if (carritoDisponible !== carrito) {
      setCarrito(carritoDisponible)
      setMensajeCarrito({ texto: 'El carrito fue ajustado por cambios de disponibilidad del catálogo.', variante: 'info' })
    }
  }, [carrito, carritoDisponible])

  useEffect(() => {
    if (!cargaCarrito.puedeGuardar) return
    try {
      // Guarda solo artículos vigentes, incluso al corregir un carrito recién cargado.
      const serializado = JSON.stringify(carritoDisponible)
      if (localStorage.getItem(claveCarrito) !== serializado) localStorage.setItem(claveCarrito, serializado)
      setAvisoCarrito('')
    } catch {
      setAvisoCarrito(avisoSinAlmacenamientoCarrito)
    }
  }, [carritoDisponible, cargaCarrito.puedeGuardar])

  function agregarAlCarrito(codigo) {
    const producto = productos.find((item) => item.codigo === codigo)
    const maximo = maximoComprable(producto)
    if (!producto || maximo < 1) {
      setMensajeCarrito({ texto: 'El producto no está disponible para agregar una unidad entera.', variante: 'warning' })
      return
    }
    const cantidad = carritoDisponible.find((articulo) => articulo.codigo === codigo)?.cantidad ?? 0
    if (cantidad >= maximo || !Number.isSafeInteger(cantidad + 1)) {
      setMensajeCarrito({ texto: `Se alcanzó el stock disponible de ${producto.nombre}.`, variante: 'warning' })
      return
    }
    setCarrito((actuales) => {
      const vigentes = ajustarCarrito(actuales, productos)
      return vigentes.some((articulo) => articulo.codigo === codigo)
        ? vigentes.map((articulo) => articulo.codigo === codigo ? { codigo, cantidad: Math.min(articulo.cantidad + 1, maximo) } : articulo)
        : [...vigentes, { codigo, cantidad: 1 }]
    })
    setMensajeCarrito({ texto: `${producto.nombre} agregado al carrito. Cantidad: ${cantidad + 1}.`, variante: 'success' })
  }

  function modificarCantidad(codigo, cantidad) {
    const producto = productos.find((item) => item.codigo === codigo)
    if (!Number.isSafeInteger(cantidad) || cantidad < 1 || cantidad > maximoComprable(producto)) return
    if (!carritoDisponible.some((articulo) => articulo.codigo === codigo)) return
    setCarrito((actuales) => ajustarCarrito(actuales, productos).map((articulo) => articulo.codigo === codigo ? { codigo, cantidad } : articulo))
    setMensajeCarrito({ texto: `Cantidad de ${producto.nombre}: ${cantidad}.`, variante: 'success' })
  }

  function eliminarDelCarrito(codigo) {
    const producto = productos.find((item) => item.codigo === codigo)
    setCarrito((actuales) => actuales.filter((articulo) => articulo.codigo !== codigo))
    setMensajeCarrito({ texto: `${producto?.nombre ?? codigo} retirado del carrito.`, variante: 'success' })
  }

  function confirmarCompra() {
    if (carritoDisponible.length === 0 || !esCarritoValido(carritoDisponible)) return
    if (!clienteSesion) {
      navegar('/login', { state: { volverAlCarrito: true } })
      return
    }

    // Confirma solo si el carrito vacío quedará guardado después de recargar.
    if (!cargaCarrito.puedeGuardar) return
    try {
      localStorage.setItem(claveCarrito, '[]')
    } catch {
      setAvisoCarrito(avisoSinAlmacenamientoCarrito)
      return
    }
    setCarrito([])
    setMensajeCarrito({ texto: 'Compra realizada correctamente.', variante: 'success' })
  }

  return (
    <>
      {aviso && <Alert variant="warning" role="status" className="m-3">{aviso}</Alert>}
      {avisoUsuarios && <Alert variant="warning" role="status" className="m-3">{avisoUsuarios}</Alert>}
      {avisoCarrito && <Alert variant="warning" role="status" className="m-3">{avisoCarrito}</Alert>}
      <Routes>
        <Route path="/" element={<PublicLayout cantidadCarrito={cantidadCarrito} mensajeCarrito={mensajeCarrito} nombreSesion={nombreSesion} cerrarSesion={cerrarSesion} />}>
          <Route index element={<InicioView productos={productos} />} />
          <Route path="productos" element={<ProductosView productos={productos} carrito={carritoDisponible} agregarAlCarrito={agregarAlCarrito} />} />
          <Route path="producto/:codigo" element={<DetalleProductoView productos={productos} carrito={carritoDisponible} agregarAlCarrito={agregarAlCarrito} />} />
          <Route path="carrito" element={<CarritoView carrito={carritoDisponible} productos={productos} modificarCantidad={modificarCantidad} eliminarDelCarrito={eliminarDelCarrito} confirmarCompra={confirmarCompra} />} />
          <Route path="nosotros" element={<NosotrosView />} />
          <Route path="blog" element={<BlogView />} />
          <Route path="blog/:slug" element={<DetalleBlogView />} />
          <Route path="contacto" element={<ContactoView />} />
          <Route path="login" element={<LoginView iniciarSesion={iniciarSesion} />} />
          <Route path="registro" element={<RegistroView registrarUsuario={(valores) => guardarUsuario(valores, { registroPublico: true })} />} />
        </Route>
        <Route path="/admin" element={<AdminLayout nombreSesion={nombreSesion} cerrarSesion={cerrarSesion} />}>
          <Route index element={<AdminInicioView productos={productos} />} />
          <Route path="productos" element={<AdminProductosView productos={productos} eliminarProducto={eliminarProducto} />} />
          <Route path="productos/nuevo" element={<AdminNuevoProductoView agregarProducto={agregarProducto} />} />
          <Route path="productos/:codigo/editar" element={<AdminEditarProductoView productos={productos} actualizarProducto={actualizarProducto} />} />
          <Route path="usuarios" element={<AdminUsuariosView usuarios={usuarios} eliminarUsuario={eliminarUsuario} />} />
          <Route path="usuarios/nuevo" element={<AdminNuevoUsuarioView agregarUsuario={agregarUsuario} />} />
          <Route path="usuarios/:id/editar" element={<AdminEditarUsuarioView usuarios={usuarios} actualizarUsuario={actualizarUsuario} />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
