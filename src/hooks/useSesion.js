import { useCallback, useEffect, useState } from 'react'
import { cargarSesion, guardarSesion, sesionVencida, sesionVigente } from '../utils/sesion'

export function useSesion() {
  const [estado, setEstado] = useState(() => ({ sesion: cargarSesion(), motivo: '' }))
  const [avisoAlmacenamiento, setAvisoAlmacenamiento] = useState('')
  const { sesion, motivo } = estado

  function establecerSesion(nuevaSesion) {
    setEstado({ sesion: nuevaSesion, motivo: '' })
  }

  const invalidarSesion = useCallback((token, mensaje) => {
    // Un 401 de una solicitud anterior no debe cerrar una sesión nueva.
    setEstado((actual) => actual.sesion?.accessToken === token ? { sesion: null, motivo: mensaje } : actual)
  }, [])

  useEffect(() => {
    const guardada = guardarSesion(sesion)
    setAvisoAlmacenamiento(!guardada && sesion ? 'La sesión solo se conserva en memoria y se perderá al recargar.' : '')
  }, [sesion])

  useEffect(() => {
    if (!sesion) return
    let temporizador
    function revisarVigencia() {
      clearTimeout(temporizador)
      if (!sesionVigente(sesion)) invalidarSesion(sesion.accessToken, sesionVencida)
      else temporizador = setTimeout(revisarVigencia, Math.min(sesion.expiraEn - Date.now(), 2147483647))
    }
    revisarVigencia()
    window.addEventListener('focus', revisarVigencia)
    return () => {
      clearTimeout(temporizador)
      window.removeEventListener('focus', revisarVigencia)
    }
  }, [sesion, invalidarSesion])

  return { sesion: sesionVigente(sesion) ? sesion : null, establecerSesion, invalidarSesion, motivo, avisoAlmacenamiento }
}
