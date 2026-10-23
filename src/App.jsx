import { Route, Routes } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'
import AdminInicioView from './views/AdminInicioView'
import InicioView from './views/InicioView'
import ProductosView from './views/ProductosView'
import DetalleProductoView from './views/DetalleProductoView'
import NosotrosView from './views/NosotrosView'
import BlogView from './views/BlogView'
import DetalleBlogView from './views/DetalleBlogView'
import ContactoView from './views/ContactoView'
import LoginView from './views/LoginView'
import RegistroView from './views/RegistroView'

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<InicioView />} />
        <Route path="productos" element={<ProductosView />} />
        <Route path="producto/:codigo" element={<DetalleProductoView />} />
        <Route path="nosotros" element={<NosotrosView />} />
        <Route path="blog" element={<BlogView />} />
        <Route path="blog/:slug" element={<DetalleBlogView />} />
        <Route path="contacto" element={<ContactoView />} />
        <Route path="login" element={<LoginView />} />
        <Route path="registro" element={<RegistroView />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminInicioView />} />
        <Route path="productos" element={null} />
        <Route path="usuarios" element={null} />
      </Route>
    </Routes>
  )
}

export default App
