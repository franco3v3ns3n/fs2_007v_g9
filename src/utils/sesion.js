const claveSesion = 'huertohogar-sesion-jwt-v1'
const claveAnterior = 'huertohogar-sesion-v1'

export const sesionVencida = 'Tu sesión venció. Vuelve a iniciar sesión.'

function leerSegmento(segmento) {
  return JSON.parse(atob(segmento.replace(/-/g, '+').replace(/_/g, '/')))
}

function leerVigencia(token, usuario) {
  if (typeof token !== 'string' || !/^[\w-]+\.[\w-]+\.[\w-]+$/.test(token)) return 0
  if (!Number.isSafeInteger(usuario?.id) || usuario.id <= 0 || typeof usuario.nombre !== 'string' || !usuario.nombre.trim()) return 0
  if (usuario.rol !== 'CLIENTE' && usuario.rol !== 'ADMINISTRADOR') return 0

  try {
    const [cabecera, payload, firma] = token.split('.')
    if (leerSegmento(cabecera).alg !== 'HS256' || firma.length !== 43) return 0
    const { sub, rol, iss, exp } = leerSegmento(payload)
    // Estas comprobaciones son de interfaz. Spring Security verifica la firma y los permisos.
    if (iss === 'huertohogar-api' && sub === String(usuario.id) && rol === usuario.rol && Number.isSafeInteger(exp)) {
      return exp * 1000
    }
  } catch {
    // Un token ilegible no representa una sesión.
  }
  return 0
}

export function sesionVigente(sesion) {
  return Boolean(sesion && Number.isSafeInteger(sesion.expiraEn) && sesion.expiraEn > Date.now())
}

export function crearSesion(respuesta) {
  const { accessToken, tokenType, expiresIn, usuario } = respuesta ?? {}
  if (tokenType !== 'Bearer' || !Number.isSafeInteger(expiresIn) || expiresIn <= 0) return null
  const expiraEn = Math.min(Date.now() + expiresIn * 1000, leerVigencia(accessToken, usuario))
  return prepararSesion(accessToken, usuario, expiraEn)
}

function prepararSesion(accessToken, usuario, expiraEn) {
  if (!sesionVigente({ expiraEn })) return null
  const { id, nombre, rol } = usuario
  return { accessToken, usuario: { id, nombre, rol }, expiraEn }
}

export function cargarSesion() {
  try {
    const guardada = JSON.parse(sessionStorage.getItem(claveSesion))
    if (!sesionVigente(guardada) || guardada.expiraEn > leerVigencia(guardada.accessToken, guardada.usuario)) return null
    return prepararSesion(guardada.accessToken, guardada.usuario, guardada.expiraEn)
  } catch {
    return null
  }
}

export function guardarSesion(sesion) {
  try {
    if (sesion) sessionStorage.setItem(claveSesion, JSON.stringify(sesion))
    else sessionStorage.removeItem(claveSesion)
    sessionStorage.removeItem(claveAnterior)
    return true
  } catch {
    return false
  }
}
