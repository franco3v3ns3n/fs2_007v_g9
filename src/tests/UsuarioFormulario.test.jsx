import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, test, vi } from 'vitest'
import UsuarioFormulario from '../components/UsuarioFormulario'

describe('UsuarioFormulario', () => {
  test('muestra validaciones y no guarda un formulario vacío', async () => {
    // Arrange
    const user = userEvent.setup()
    const onGuardar = vi.fn()
    render(<MemoryRouter><UsuarioFormulario onGuardar={onGuardar} /></MemoryRouter>)

    // Act
    await user.click(screen.getByRole('button', { name: 'Guardar usuario' }))

    // Assert
    for (const mensaje of ['Ingresa el nombre.', 'Ingresa el apellido.', 'Ingresa el correo electrónico.', 'Ingresa el teléfono.', 'Ingresa la dirección.', 'Ingresa la contraseña.']) {
      expect(screen.getByText(mensaje)).toBeInTheDocument()
    }
    expect(screen.getByLabelText('Nombre:')).toHaveAttribute('aria-invalid', 'true')
    expect(onGuardar).not.toHaveBeenCalled()
  })

  test('guarda los datos válidos sin entregar la contraseña al callback', async () => {
    // Arrange
    const user = userEvent.setup()
    const valores = { nombre: 'Camila', apellido: 'Prueba', correo: 'camila@example.com', telefono: '912345678', direccion: 'Calle Simulada 123' }
    const onGuardar = vi.fn().mockReturnValue({ usuario: { id: 99, ...valores } })
    render(<MemoryRouter><UsuarioFormulario onGuardar={onGuardar} /></MemoryRouter>)

    // Act
    await user.type(screen.getByLabelText('Nombre:'), valores.nombre)
    await user.type(screen.getByLabelText('Apellido:'), valores.apellido)
    await user.type(screen.getByLabelText('Correo electrónico:'), valores.correo)
    await user.type(screen.getByLabelText('Teléfono:'), valores.telefono)
    await user.type(screen.getByLabelText('Dirección:'), valores.direccion)
    await user.type(screen.getByLabelText('Contraseña:'), 'demo123')
    await user.click(screen.getByRole('button', { name: 'Guardar usuario' }))

    // Assert
    expect(onGuardar).toHaveBeenCalledTimes(1)
    expect(onGuardar).toHaveBeenCalledWith(valores)
    expect(onGuardar.mock.calls[0][0]).not.toHaveProperty('password')
  })
})
