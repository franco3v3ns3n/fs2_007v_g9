import { useEffect, useState } from 'react'
import { Alert, Button } from 'react-bootstrap'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { productosIniciales } from './data/productosIniciales'
import { crearProducto, listarProductos } from './services/productoService'
import { getErrorMessage } from './utils/getErrorMessage'
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

function normalizarDatosProducto(valores) {
  return {
    codigo: normalizarCodigo(valores.codigo),
    nombre: valores.nombre.trim(),
    categoria: valores.categoria,
    precio: Number(valores.precio),
    stock: Number(valores.stock),
    descripcion: valores.descripcion.trim(),
    unidadPrecio: valores.unidadPrecio.trim(),
    unidadStock: valores.unidadStock.trim(),
    origen: valores.origen.trim(),
  }
}

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
  const [catalogo, setCatalogo] = useState({ productos: carga.productos, remoto: false, cambiosLocales: false })
  const { productos, remoto, cambiosLocales } = catalogo
  const [consulta, setConsulta] = useState({ cargando: true, error: '' })
  const [intento, setIntento] = useState(0)
  const [aviso, setAviso] = useState(carga.aviso)

  useEffect(() => {
    const controlador = new AbortController()
    const { signal } = controlador
    async function consultarCatalogo() {
      try {
        const resultado = await listarProductos(signal)
        if (signal.aborted) return
        if (!esCatalogoValido(resultado)) {
          setConsulta({ cargando: false, error: 'El servidor devolvió un catálogo con datos inválidos.' })
          return
        }
        setCatalogo({ productos: resultado, remoto: true, cambiosLocales: false })
        setConsulta({ cargando: false, error: '' })
      } catch (error) {
        if (!signal.aborted) setConsulta({ cargando: false, error: getErrorMessage(error) })
      }
    }
    consultarCatalogo()
    return () => controlador.abort()
  }, [intento])

  function reintentarConsulta() {
    setConsulta({ cargando: true, error: '' })
    setIntento((actual) => actual + 1)
  }

  useEffect(() => {
    // El GET reemplaza la vista, sin modificar la copia local de respaldo.
    if (!carga.puedeGuardar || (remoto && !cambiosLocales)) return
    try {
      const serializado = JSON.stringify(productos)
      if (localStorage.getItem(claveProductos) !== serializado) localStorage.setItem(claveProductos, serializado)
      setAviso('')
    } catch {
      setAviso(avisoSinAlmacenamiento)
    }
  }, [productos, carga.puedeGuardar, remoto, cambiosLocales])

  function modificarCatalogoLocalmente(modificar) {
    setCatalogo((actual) => ({ ...actual, productos: modificar(actual.productos), cambiosLocales: true }))
  }

  function actualizarProducto(codigoOriginal, valores) {
    const errores = validarProducto(valores, productos, codigoOriginal)
    const anterior = productos.find((producto) => producto.codigo === codigoOriginal)
    if (!anterior) errores.general = 'Producto no encontrado.'
    if (Object.keys(errores).length) return { errores }

    const datos = normalizarDatosProducto(valores)
    const origen = datos.origen || 'No especificado'
    const producto = {
      ...anterior,
      ...datos,
      origen,
      origenSimulado: origen === anterior.origen ? anterior.origenSimulado : true,
      imagenReferencial: anterior.imagenReferencial ?? false,
    }
    modificarCatalogoLocalmente((actuales) => actuales.map((item) => item.codigo === codigoOriginal ? producto : item))
    return { producto }
  }

  async function agregarProducto(valores) {
    const errores = validarProducto(valores, productos)
    if (Object.keys(errores).length) return { errores }
    if (!remoto) {
      return { errores: { general: 'Para guardar el producto, recupera la conexión y vuelve a consultar el catálogo del servidor.' } }
    }

    try {
      const producto = await crearProducto(normalizarDatosProducto(valores))
      if (!esCatalogoValido([producto]) || !Number.isSafeInteger(producto.id)) {
        return { errores: { general: 'La respuesta del servidor no contiene un producto válido. Consulta el catálogo antes de reintentar.' } }
      }
      setCatalogo((actual) => ({
        ...actual,
        productos: [...actual.productos.filter((item) => item.codigo !== producto.codigo), producto],
      }))
      return { producto }
    } catch (error) {
      const campo = error?.response?.status === 409 ? 'codigo' : 'general'
      return { errores: { [campo]: getErrorMessage(error, 'No se pudo guardar el producto') } }
    }
  }

  function eliminarProducto(codigo) {
    modificarCatalogoLocalmente((actuales) => actuales.filter((producto) => producto.codigo !== codigo))
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
  const carritoParaGuardar = remoto ? carritoDisponible : carrito
  const cantidadCarrito = carritoDisponible.reduce((suma, articulo) => suma + articulo.cantidad, 0)

  useEffect(() => {
    setMensajeCarrito(null)
  }, [ubicacion])

  useEffect(() => {
    if (remoto && carritoDisponible !== carrito) {
      setCarrito(carritoDisponible)
      setMensajeCarrito({ texto: 'El carrito fue ajustado por cambios de disponibilidad del catálogo.', variante: 'info' })
    }
  }, [carrito, carritoDisponible, remoto])

  useEffect(() => {
    if (!cargaCarrito.puedeGuardar) return
    try {
      // El respaldo local puede desconocer artículos que siguen disponibles en el servidor.
      const serializado = JSON.stringify(carritoParaGuardar)
      if (localStorage.getItem(claveCarrito) !== serializado) localStorage.setItem(claveCarrito, serializado)
      setAvisoCarrito('')
    } catch {
      setAvisoCarrito(avisoSinAlmacenamientoCarrito)
    }
  }, [carritoParaGuardar, cargaCarrito.puedeGuardar])

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
      const vigentes = remoto ? ajustarCarrito(actuales, productos) : actuales
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
    setCarrito((actuales) => (remoto ? ajustarCarrito(actuales, productos) : actuales)
      .map((articulo) => articulo.codigo === codigo ? { codigo, cantidad } : articulo))
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

    if (!remoto && carritoDisponible !== carrito) {
      setMensajeCarrito({ texto: 'Consulta el catálogo del servidor antes de confirmar todos los artículos de tu carrito.', variante: 'warning' })
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
      {consulta.cargando && <div className="alert alert-info m-3" aria-live="polite">Consultando el catálogo del servidor. Se muestran datos locales mientras carga.</div>}
      {consulta.error && (
        <div className="alert alert-warning m-3 d-flex flex-wrap align-items-center gap-2" aria-live="polite">
          <span>{consulta.error} Se muestran datos locales.</span>
          <Button variant="outline-dark" size="sm" onClick={reintentarConsulta}>Reintentar consulta</Button>
        </div>
      )}
      {aviso && (!remoto || cambiosLocales || aviso === avisoSinAlmacenamiento) && <Alert variant="warning" role="status" className="m-3">{aviso}</Alert>}
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
          <Route path="productos/:codigo/editar" element={<AdminEditarProductoView key={remoto ? 'servidor' : 'local'} productos={productos} actualizarProducto={actualizarProducto} />} />
          <Route path="usuarios" element={<AdminUsuariosView usuarios={usuarios} eliminarUsuario={eliminarUsuario} />} />
          <Route path="usuarios/nuevo" element={<AdminNuevoUsuarioView agregarUsuario={agregarUsuario} />} />
          <Route path="usuarios/:id/editar" element={<AdminEditarUsuarioView usuarios={usuarios} actualizarUsuario={actualizarUsuario} />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
