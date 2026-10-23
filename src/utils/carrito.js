export function esCarritoValido(carrito) {
  if (!Array.isArray(carrito)) return false
  const codigos = new Set()
  return carrito.every((articulo) => {
    if (!articulo || typeof articulo !== 'object') return false
    const campos = Object.keys(articulo)
    if (campos.length !== 2 || !campos.includes('codigo') || !campos.includes('cantidad')) return false
    if (typeof articulo.codigo !== 'string' || !articulo.codigo.trim() || codigos.has(articulo.codigo)) return false
    if (!Number.isSafeInteger(articulo.cantidad) || articulo.cantidad <= 0) return false
    codigos.add(articulo.codigo)
    return true
  })
}

export function maximoComprable(producto) {
  return producto ? Math.floor(producto.stock) : 0
}

export function ajustarCarrito(carrito, productos) {
  let cambio = false
  const ajustado = []
  for (const articulo of carrito) {
    const producto = productos.find((item) => item.codigo === articulo.codigo)
    const maximo = maximoComprable(producto)
    if (maximo < 1) {
      cambio = true
      continue
    }
    if (articulo.cantidad > maximo) {
      ajustado.push({ codigo: articulo.codigo, cantidad: maximo })
      cambio = true
    } else ajustado.push(articulo)
  }
  // Mantener la referencia evita actualizaciones de estado y efectos innecesarios.
  return cambio ? ajustado : carrito
}
