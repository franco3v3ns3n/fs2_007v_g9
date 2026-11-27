import { useEffect, useState } from 'react'

export function useConsultaUsuarios(consultar) {
  const [intento, setIntento] = useState(0)
  const [resultado, setResultado] = useState(null)
  const consultaActual = resultado?.consultar === consultar && resultado.intento === intento ? resultado : null

  useEffect(() => {
    // El controlador se conserva para cancelar la petición al cambiar de vista o de sesión.
    const controlador = new AbortController()
    async function cargar() {
      try {
        const datos = await consultar(controlador.signal)
        if (!controlador.signal.aborted) setResultado({ consultar, intento, datos })
      } catch (error) {
        if (!controlador.signal.aborted) setResultado({ consultar, intento, error })
      }
    }
    cargar()
    return () => controlador.abort()
  }, [consultar, intento])

  function recargar() {
    setIntento((anterior) => anterior + 1)
  }

  function actualizarDatos(actualizar) {
    setResultado((actual) => actual?.consultar === consultar && actual.intento === intento && actual.datos
      ? { ...actual, datos: actualizar(actual.datos) } : actual)
  }

  return { datos: consultaActual?.datos, error: consultaActual?.error, cargando: !consultaActual, recargar, actualizarDatos }
}
