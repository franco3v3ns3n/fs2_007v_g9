import { Form, InputGroup } from 'react-bootstrap'

function CampoFormulario({ id, nombre, etiqueta, valor, onChange, error, tipo = 'text', filas, prefijo, requerido = true }) {
  const errorId = `error-${id}`
  const prefijoId = `prefijo-${id}`
  const entrada = (
    <Form.Control id={id} name={nombre} type={filas ? undefined : tipo}
      as={filas ? 'textarea' : 'input'} rows={filas}
      value={valor} onChange={onChange} required={requerido}
      aria-invalid={Boolean(error)}
      aria-describedby={prefijo ? `${prefijoId} ${errorId}` : errorId} />
  )

  return (
    <Form.Group className="mb-3">
      <Form.Label htmlFor={id}>{etiqueta}</Form.Label>
      {prefijo ? (
        <InputGroup>
          <InputGroup.Text id={prefijoId}>{prefijo}</InputGroup.Text>
          {entrada}
        </InputGroup>
      ) : entrada}
      <small className="text-danger d-block mt-1" id={errorId}>{error}</small>
    </Form.Group>
  )
}

export default CampoFormulario
