import { describe, expect, test } from 'vitest'
import { ajustarCarrito, esCarritoValido } from '../utils/carrito'

describe('Funciones del carrito', () => {
  test('acepta artículos válidos y rechaza cantidades inválidas y códigos duplicados', () => {
    // Arrange
    const valido = [{ codigo: 'FR001', cantidad: 2 }]
    const invalidos = [
      [{ codigo: 'FR001', cantidad: -1 }],
      [{ codigo: 'FR001', cantidad: 1.5 }],
      [{ codigo: 'FR001', cantidad: 1 }, { codigo: 'FR001', cantidad: 2 }],
    ]

    // Act
    const resultadoValido = esCarritoValido(valido)
    const resultadosInvalidos = invalidos.map(esCarritoValido)

    // Assert
    expect(resultadoValido).toBe(true)
    expect(resultadosInvalidos).toEqual([false, false, false])
  })

  test('limita al stock entero y retira productos inexistentes o sin disponibilidad', () => {
    // Arrange
    const productos = [{ codigo: 'FR001', stock: 2.8 }, { codigo: 'VR001', stock: 0 }, { codigo: 'VR002', stock: 0.5 }]
    const carrito = [
      { codigo: 'FR001', cantidad: 5 },
      { codigo: 'ELIMINADO', cantidad: 1 },
      { codigo: 'VR001', cantidad: 1 },
      { codigo: 'VR002', cantidad: 1 },
    ]

    // Act
    const resultado = ajustarCarrito(carrito, productos)

    // Assert
    expect(resultado).toEqual([{ codigo: 'FR001', cantidad: 2 }])
    expect(carrito[0]).toEqual({ codigo: 'FR001', cantidad: 5 })
    expect(productos[0].stock).toBe(2.8)
  })
})
