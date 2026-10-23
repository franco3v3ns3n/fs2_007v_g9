import { useEffect, useState } from 'react'
import { Alert } from 'react-bootstrap'
import { Route, Routes } from 'react-router-dom'
import { productosIniciales } from './data/productosIniciales'
import { esCatalogoValido, normalizarCodigo, validarProducto } from './utils/productos'
import { usuariosIniciales } from './data/usuariosIniciales'
import { esConjuntoUsuariosValido, generarIdUsuario, normalizarCorreo, validarUsuario } from './utils/usuarios'
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
const avisoSinAlmacenamientoUsuarios = 'El almacenamiento local de usuarios no está disponible. Los cambios de esta sesión no podrán conservarse después de recargar.'

function cargarUsuarios() {
  const iniciales = usuariosIniciales.map((usuario) => ({ ...usuario }))
  try {
    const guardado = localStorage.getItem(claveUsuarios)
    if (guardado === null) return { usuarios: iniciales, puedeGuardar: true, aviso: '' }
    const usuarios = JSON.parse(guardado)
    if (esConjuntoUsuariosValido(usuarios)) return { usuarios, puedeGuardar: true, aviso: '' }
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

function App() {
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

  function guardarUsuario(valores, idOriginal) {
    const errores = validarUsuario(valores, usuarios, idOriginal)
    const anterior = usuarios.find((usuario) => usuario.id === idOriginal)
    if (idOriginal !== undefined && !anterior) errores.general = 'Usuario no encontrado.'
    if (Object.keys(errores).length) return { errores }

    const usuario = {
      id: anterior?.id ?? generarIdUsuario(usuarios),
      nombre: valores.nombre.trim(),
      apellido: valores.apellido.trim(),
      correo: normalizarCorreo(valores.correo),
      telefono: valores.telefono.trim(),
      direccion: valores.direccion.trim(),
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
    return guardarUsuario(valores, idOriginal)
  }

  function eliminarUsuario(id) {
    setUsuarios((actuales) => actuales.filter((usuario) => usuario.id !== id))
  }

  return (
    <>
      {aviso && <Alert variant="warning" role="status" className="m-3">{aviso}</Alert>}
      {avisoUsuarios && <Alert variant="warning" role="status" className="m-3">{avisoUsuarios}</Alert>}
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<InicioView productos={productos} />} />
          <Route path="productos" element={<ProductosView productos={productos} />} />
          <Route path="producto/:codigo" element={<DetalleProductoView productos={productos} />} />
          <Route path="nosotros" element={<NosotrosView />} />
          <Route path="blog" element={<BlogView />} />
          <Route path="blog/:slug" element={<DetalleBlogView />} />
          <Route path="contacto" element={<ContactoView />} />
          <Route path="login" element={<LoginView />} />
          <Route path="registro" element={<RegistroView />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
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
