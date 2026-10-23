export function validarCorreo(correo) {
  if (correo.trim() === '') return 'Ingresa tu correo electrónico.'
  if (!correo.trim().includes('@')) return 'Ingresa un correo electrónico válido.'
  return ''
}

export function validarPassword(password) {
  if (password === '') return 'Ingresa tu contraseña.'
  if (password.length < 4 || password.length > 10) return 'La contraseña debe tener entre 4 y 10 caracteres.'
  return ''
}

export function validarTelefono(valor) {
  const telefono = valor.trim()
  if (telefono === '') return 'Ingresa tu teléfono.'
  if (telefono.length !== 9) return 'Ingresa un teléfono válido de 9 dígitos.'
  for (const digito of telefono) {
    if (!'0123456789'.includes(digito)) return 'Ingresa un teléfono válido de 9 dígitos.'
  }
  return ''
}
