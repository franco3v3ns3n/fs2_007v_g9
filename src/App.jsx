import { Route, Routes } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import InicioView from './views/InicioView'
import ProductosView from './views/ProductosView'

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<InicioView />} />
        <Route path="productos" element={<ProductosView />} />
        <Route path="nosotros" element={null} />
        <Route path="blog" element={null} />
        <Route path="contacto" element={null} />
        <Route path="login" element={null} />
        <Route path="registro" element={null} />
      </Route>
    </Routes>
  )
}

export default App
