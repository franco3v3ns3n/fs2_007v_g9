import { StrictMode } from 'react'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import App from '../App'

const claveCarrito = 'huertohogar-carrito-v1'
const claveSesion = 'huertohogar-sesion-v1'
const claveCatalogo = 'huertohogar-productos-v1'
const carritoInicial = JSON.stringify([{ codigo: 'FR001', cantidad: 2 }, { codigo: 'VR001', cantidad: 1 }])
const sesionCliente = JSON.stringify({ tipo: 'cliente', id: 1 })

function montarCarrito() {
  return render(<StrictMode><MemoryRouter initialEntries={['/carrito']}><App /></MemoryRouter></StrictMode>)
}

async function ingresar(user, correo, password) {
  await user.type(screen.getByLabelText('Correo electrónico:'), correo)
  await user.type(screen.getByLabelText('Contraseña:'), password)
  await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('Confirmación de compra', () => {
  beforeEach(() => {
    localStorage.setItem(claveCarrito, carritoInicial)
  })

  test('conserva el carrito si se abandona el login o fallan las credenciales y regresa sin comprar al autenticar al cliente', async () => {
    const user = userEvent.setup()
    montarCarrito()
    const resumen = screen.getByRole('heading', { name: 'Resumen del carrito' }).closest('aside')
    await user.click(within(resumen).getByRole('button', { name: 'Confirmar compra' }))

    expect(screen.getByRole('heading', { name: 'Inicio de sesión' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Cliente' })).toHaveAttribute('aria-selected', 'true')
    expect(localStorage.getItem(claveCarrito)).toBe(carritoInicial)
    await ingresar(user, 'ana.torres@example.com', 'Incorrecta')
    expect(screen.getByRole('alert')).toHaveTextContent('Correo electrónico o contraseña incorrectos.')
    expect(localStorage.getItem(claveCarrito)).toBe(carritoInicial)

    await user.click(screen.getByRole('link', { name: 'Carrito (3)' }))
    expect(screen.getAllByRole('article')).toHaveLength(2)
    expect(localStorage.getItem(claveCarrito)).toBe(carritoInicial)
    await user.click(screen.getByRole('button', { name: 'Confirmar compra' }))
    await ingresar(user, 'ana.torres@example.com', 'AnaDemo2')

    expect(screen.getByRole('heading', { name: 'Carrito de compras' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirmar compra' })).toBeInTheDocument()
    expect(screen.queryByText('Compra realizada correctamente.')).not.toBeInTheDocument()
    expect(localStorage.getItem(claveCarrito)).toBe(carritoInicial)
  })

  test('pide una sesión de cliente al administrador y conserva el destino administrativo de su pestaña', async () => {
    const user = userEvent.setup()
    const sesionAdmin = JSON.stringify({ tipo: 'administrador', id: 'admin@huertohogar.cl' })
    sessionStorage.setItem(claveSesion, sesionAdmin)
    montarCarrito()
    await user.click(screen.getByRole('button', { name: 'Confirmar compra' }))

    expect(screen.getByRole('tab', { name: 'Cliente' })).toHaveAttribute('aria-selected', 'true')
    expect(localStorage.getItem(claveCarrito)).toBe(carritoInicial)
    expect(sessionStorage.getItem(claveSesion)).toBe(sesionAdmin)
    await user.click(screen.getByRole('tab', { name: 'Administrador' }))
    await ingresar(user, 'admin@huertohogar.cl', 'AdminDemo2')
    expect(screen.getByRole('heading', { name: 'Administración HuertoHogar' })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Volver a tienda' }))
    await user.click(screen.getByRole('link', { name: 'Carrito (3)' }))
    await user.click(screen.getByRole('button', { name: 'Confirmar compra' }))
    await ingresar(user, 'ana.torres@example.com', 'AnaDemo2')
    expect(screen.getByRole('heading', { name: 'Carrito de compras' })).toBeInTheDocument()
    expect(sessionStorage.getItem(claveSesion)).toBe(sesionCliente)
    expect(localStorage.getItem(claveCarrito)).toBe(carritoInicial)
  })

  test('vacía y persiste el carrito sin alterar inventario ni sesión y permite volver a agregar productos', async () => {
    const user = userEvent.setup()
    sessionStorage.setItem(claveSesion, sesionCliente)
    const app = montarCarrito()
    const catalogo = localStorage.getItem(claveCatalogo)
    expect(catalogo).not.toBeNull()

    await user.click(screen.getByRole('button', { name: 'Confirmar compra' }))
    expect(screen.getByRole('status')).toHaveTextContent('Compra realizada correctamente.')
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Carrito (0)' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Confirmar compra' })).not.toBeInTheDocument()
    expect(localStorage.getItem(claveCarrito)).toBe('[]')
    expect(localStorage.getItem(claveCatalogo)).toBe(catalogo)
    expect(sessionStorage.getItem(claveSesion)).toBe(sesionCliente)

    app.unmount()
    montarCarrito()
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument()
    expect(screen.getByText('Hola, Ana')).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Ver productos' }))
    await user.click(screen.getByRole('button', { name: 'Agregar al carrito: Manzanas Fuji' }))
    expect(screen.getByRole('link', { name: 'Carrito (1)' })).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(claveCarrito))).toEqual([{ codigo: 'FR001', cantidad: 1 }])
  })

  test('conserva el carrito y permite reintentar si no puede persistir la confirmación', async () => {
    const user = userEvent.setup()
    sessionStorage.setItem(claveSesion, sesionCliente)
    montarCarrito()
    const guardar = vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw new DOMException('Cuota superada', 'QuotaExceededError')
    })
    try {
      await user.click(screen.getByRole('button', { name: 'Confirmar compra' }))
      expect(screen.queryByText('Compra realizada correctamente.')).not.toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Carrito (3)' })).toBeInTheDocument()
      expect(localStorage.getItem(claveCarrito)).toBe(carritoInicial)
    } finally {
      guardar.mockRestore()
    }
    await user.click(screen.getByRole('button', { name: 'Confirmar compra' }))
    expect(screen.getByRole('status')).toHaveTextContent('Compra realizada correctamente.')
    expect(localStorage.getItem(claveCarrito)).toBe('[]')
  })
})

describe('App y persistencia del carrito', () => {
  test('actualiza el contador y persiste el artículo al agregar Manzanas Fuji', async () => {
    // Arrange: almacenamiento de jsdom vacío, catálogo inicial conocido y ruta en memoria.
    const user = userEvent.setup()
    render(<StrictMode><MemoryRouter initialEntries={['/productos']}><App /></MemoryRouter></StrictMode>)
    expect(screen.getByRole('link', { name: 'Carrito (0)' })).toBeInTheDocument()

    // Act
    await user.click(screen.getByRole('button', { name: 'Agregar al carrito: Manzanas Fuji' }))

    // Assert
    expect(screen.getByRole('link', { name: 'Carrito (1)' })).toBeInTheDocument()
    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem('huertohogar-carrito-v1'))).toEqual([{ codigo: 'FR001', cantidad: 1 }])
    })
  })
})
