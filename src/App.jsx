import { Alert, Container } from 'react-bootstrap'
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Container as="main" className="py-5">
            <h1 className="mb-4">HuertoHogar</h1>
            <Alert variant="success">
              React funciona. HuertoHogar está listo para continuar su desarrollo.
            </Alert>
          </Container>
        }
      />
    </Routes>
  )
}

export default App
