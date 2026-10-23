export const categoriasProducto = [
  'Frutas Frescas',
  'Verduras Orgánicas',
  'Productos Orgánicos',
  'Productos Lácteos',
]

export function normalizarCodigo(codigo) {
  return codigo.trim().toUpperCase()
}

export function validarProducto(valores, productos, codigoOriginal) {
  const codigo = normalizarCodigo(valores.codigo)
  const errores = {}
  if (!codigo) errores.codigo = 'Ingresa el código del producto.'
  else if (!/^[A-Z0-9-]+$/.test(codigo)) errores.codigo = 'Utiliza únicamente letras, números y guiones en el código.'
  else if (productos.some((producto) => producto.codigo === codigo && producto.codigo !== codigoOriginal)) {
    errores.codigo = 'Ya existe un producto con este código.'
  }
  if (!valores.nombre.trim()) errores.nombre = 'Ingresa el nombre del producto.'
  if (!categoriasProducto.includes(valores.categoria)) errores.categoria = 'Selecciona una categoría.'
  if (String(valores.precio).trim() === '' || !Number.isFinite(Number(valores.precio)) || Number(valores.precio) <= 0) {
    errores.precio = 'Ingresa un precio válido mayor que 0.'
  }
  if (String(valores.stock).trim() === '' || !Number.isFinite(Number(valores.stock)) || Number(valores.stock) < 0) {
    errores.stock = 'Ingresa un stock válido igual o mayor que 0.'
  }
  if (!valores.descripcion.trim()) errores.descripcion = 'Ingresa la descripción del producto.'
  if (!valores.unidadPrecio.trim()) errores.unidadPrecio = 'Ingresa la unidad de precio.'
  if (!valores.unidadStock.trim()) errores.unidadStock = 'Ingresa la unidad de stock.'
  return errores
}

export function esCatalogoValido(productos) {
  if (!Array.isArray(productos)) return false
  const codigos = new Set()
  return productos.every((producto) => {
    if (!producto || typeof producto !== 'object') return false
    const textos = ['codigo', 'nombre', 'categoria', 'unidadPrecio', 'unidadStock', 'descripcion', 'imagen', 'origen']
    if (!textos.every((campo) => typeof producto[campo] === 'string' && producto[campo].trim() !== '')) return false
    if (!/^[A-Z0-9-]+$/.test(producto.codigo) || codigos.has(producto.codigo)) return false
    if (!categoriasProducto.includes(producto.categoria)) return false
    if (typeof producto.precio !== 'number' || !Number.isFinite(producto.precio) || producto.precio <= 0) return false
    if (typeof producto.stock !== 'number' || !Number.isFinite(producto.stock) || producto.stock < 0) return false
    if (typeof producto.origenSimulado !== 'boolean') return false
    if (producto.imagenReferencial !== undefined && typeof producto.imagenReferencial !== 'boolean') return false
    codigos.add(producto.codigo)
    return true
  })
}
