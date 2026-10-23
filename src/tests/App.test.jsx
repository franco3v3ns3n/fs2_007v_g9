import { StrictMode } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, test } from 'vitest'
import App from '../App'

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
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
