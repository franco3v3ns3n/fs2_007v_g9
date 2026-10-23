import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, test, vi } from 'vitest'
import CarritoView from '../views/CarritoView'

describe('CarritoView', () => {
  test('muestra el carrito vacío y el enlace al catálogo', () => {
    // Arrange
    const carrito = []

    // Act
    render(<MemoryRouter><CarritoView carrito={carrito} productos={[]} modificarCantidad={vi.fn()} eliminarDelCarrito={vi.fn()} /></MemoryRouter>)

    // Assert
    expect(screen.getByRole('heading', { name: 'Carrito de compras' })).toBeInTheDocument()
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver productos' })).toHaveAttribute('href', '/productos')
  })

  test('calcula subtotales, total y cantidad y avisa al aumentar una cantidad', async () => {
    // Arrange
    const user = userEvent.setup()
    const productos = [
      { codigo: 'FR001', nombre: 'Manzanas Fuji', precio: 1200, stock: 150, unidadPrecio: 'kilo', imagen: '/img/productos/fr001-manzanas-fuji.webp' },
      { codigo: 'VR001', nombre: 'Zanahorias Orgánicas', precio: 900, stock: 100, unidadPrecio: 'kilo', imagen: '/img/productos/vr001-zanahorias-organicas.webp' },
    ]
    const carrito = [{ codigo: 'FR001', cantidad: 2 }, { codigo: 'VR001', cantidad: 1 }]
    const modificarCantidad = vi.fn()
    render(<MemoryRouter><CarritoView carrito={carrito} productos={productos} modificarCantidad={modificarCantidad} eliminarDelCarrito={vi.fn()} /></MemoryRouter>)

    // Act
    await user.click(screen.getByRole('button', { name: 'Aumentar cantidad de Manzanas Fuji' }))

    // Assert: las props no cambian hasta que el padre procese el callback.
    const articulos = screen.getAllByRole('article')
    expect(within(articulos[0]).getByText('Subtotal:').parentElement).toHaveTextContent('Subtotal: $2.400')
    expect(within(articulos[1]).getByText('Subtotal:').parentElement).toHaveTextContent('Subtotal: $900')
    expect(screen.getByText('Total del carrito:').parentElement).toHaveTextContent('Total del carrito: $3.300')
    expect(screen.getByText('Número total de artículos:').parentElement).toHaveTextContent('Número total de artículos: 3')
    expect(modificarCantidad).toHaveBeenCalledTimes(1)
    expect(modificarCantidad).toHaveBeenCalledWith('FR001', 3)
  })
})
