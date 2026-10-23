import { Route, Routes } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import InicioView from './views/InicioView'
import ProductosView from './views/ProductosView'
import DetalleProductoView from './views/DetalleProductoView'
import NosotrosView from './views/NosotrosView'
import BlogView from './views/BlogView'
import DetalleBlogView from './views/DetalleBlogView'

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
        <Route path="contacto" element={null} />
        <Route path="login" element={null} />
        <Route path="registro" element={null} />
      </Route>
    </Routes>
  )
}

export default App
