import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, test, vi } from 'vitest'
import ProductCard from '../components/ProductCard'

const producto = {
  codigo: 'FR-PRUEBA',
  nombre: 'Manzanas de prueba',
  categoria: 'Frutas Frescas',
  precio: 1200,
  unidadPrecio: 'kilo',
  stock: 5,
  unidadStock: 'kilos',
  descripcion: 'Producto simulado para verificar la tarjeta.',
  imagen: '/img/productos/fr001-manzanas-fuji.webp',
}

describe('ProductCard', () => {
  test('muestra nombre, código, precio y stock recibidos por props', () => {
    // Arrange
    const agregarAlCarrito = vi.fn()

    // Act
    render(<MemoryRouter><ProductCard producto={producto} cantidadEnCarrito={0} agregarAlCarrito={agregarAlCarrito} /></MemoryRouter>)

    // Assert
    expect(screen.getByRole('heading', { name: 'Manzanas de prueba' })).toBeInTheDocument()
    expect(screen.getByText('Código:').parentElement).toHaveTextContent('Código: FR-PRUEBA')
    expect(screen.getByText('Precio:').parentElement).toHaveTextContent('Precio: $1.200 por kilo')
    expect(screen.getByText('Stock:').parentElement).toHaveTextContent('Stock: 5 kilos')
  })

  test('llama una sola vez al callback con el código al agregar al carrito', async () => {
    // Arrange
    const user = userEvent.setup()
    const agregarAlCarrito = vi.fn()
    render(<MemoryRouter><ProductCard producto={producto} cantidadEnCarrito={0} agregarAlCarrito={agregarAlCarrito} /></MemoryRouter>)

    // Act
    await user.click(screen.getByRole('button', { name: 'Agregar al carrito: Manzanas de prueba' }))

    // Assert
    expect(agregarAlCarrito).toHaveBeenCalledTimes(1)
    expect(agregarAlCarrito).toHaveBeenCalledWith('FR-PRUEBA')
  })

  test('deshabilita agregar y explica la falta de stock', async () => {
    // Arrange
    const user = userEvent.setup()
    const agregarAlCarrito = vi.fn()
    render(<MemoryRouter><ProductCard producto={{ ...producto, stock: 0 }} cantidadEnCarrito={0} agregarAlCarrito={agregarAlCarrito} /></MemoryRouter>)

    // Act
    const boton = screen.getByRole('button', { name: 'Agregar al carrito: Manzanas de prueba' })
    await user.click(boton)

    // Assert
    expect(boton).toBeDisabled()
    expect(screen.getByText('No disponible para agregar una unidad entera.')).toBeInTheDocument()
    expect(agregarAlCarrito).not.toHaveBeenCalled()
  })
})
