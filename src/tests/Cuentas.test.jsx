import { StrictMode } from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Link, MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import App from '../App'
import { validarPassword } from '../utils/validaciones'

const claveUsuarios = 'huertohogar-usuarios-v1'
const datosCliente = {
  'Nombre:': 'Lucía',
  'Apellido:': 'Vega',
  'Correo electrónico:': 'LUCIA@example.com',
  'Teléfono:': '912345678',
}
const usuarioAntiguo = {
  id: 12,
  nombre: 'Hugo',
  apellido: 'Lagos',
  correo: 'Hugo@example.com',
  telefono: '978901234',
  direccion: 'Calle de Prueba 12',
}

function montarApp(ruta) {
  return render(
    <StrictMode>
      <MemoryRouter initialEntries={[ruta]}>
        <Link to="/admin/usuarios">Abrir listado de usuarios</Link>
        <App />
      </MemoryRouter>
    </StrictMode>,
  )
}

function leerUsuarios() {
  return JSON.parse(localStorage.getItem(claveUsuarios))
}

async function completarCampos(user, campos) {
  for (const [etiqueta, valor] of Object.entries(campos)) {
    await user.type(screen.getByLabelText(etiqueta), valor)
  }
}

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Registro público', () => {
  test('registra al cliente sin dirección, lo muestra en administración y conserva la cuenta al recargar', async () => {
    const user = userEvent.setup()
    const app = montarApp('/registro')
    const password = ' Demo2 '
    await completarCampos(user, { ...datosCliente, 'Contraseña:': password, 'Confirmar contraseña:': password })
    await user.click(screen.getByRole('button', { name: 'Registrarse' }))

    expect(screen.getByRole('status')).toHaveTextContent('Cuenta creada correctamente.')
    expect(screen.getByLabelText('Contraseña:')).toHaveValue('')
    expect(screen.getByLabelText('Confirmar contraseña:')).toHaveValue('')
    const cuenta = { id: 6, nombre: 'Lucía', apellido: 'Vega', correo: 'lucia@example.com', telefono: '912345678', direccion: '', password }
    expect(leerUsuarios()).toContainEqual(cuenta)

    await user.click(screen.getByRole('link', { name: 'Abrir listado de usuarios' }))
    expect(screen.getByRole('row', { name: /Lucía Vega/ })).toBeInTheDocument()

    app.unmount()
    montarApp('/admin/usuarios')
    expect(screen.getByRole('row', { name: /Lucía Vega/ })).toBeInTheDocument()
    expect(leerUsuarios()).toContainEqual(cuenta)
  })

  test('rechaza un correo que ya existe aunque cambie el uso de mayúsculas', async () => {
    const user = userEvent.setup()
    montarApp('/registro')
    const usuariosAntes = leerUsuarios()
    await completarCampos(user, {
      ...datosCliente,
      'Correo electrónico:': 'ANA.TORRES@EXAMPLE.COM',
      'Contraseña:': 'Demo2',
      'Confirmar contraseña:': 'Demo2',
    })
    await user.click(screen.getByRole('button', { name: 'Registrarse' }))

    expect(screen.getByText('Ya existe un usuario con este correo electrónico.')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    expect(leerUsuarios()).toEqual(usuariosAntes)
  })

  test('exige todos los campos del registro antes de guardar', async () => {
    const user = userEvent.setup()
    montarApp('/registro')
    const usuariosAntes = leerUsuarios()
    await user.click(screen.getByRole('button', { name: 'Registrarse' }))

    for (const etiqueta of [...Object.keys(datosCliente), 'Contraseña:', 'Confirmar contraseña:']) {
      expect(screen.getByLabelText(etiqueta)).toHaveAttribute('aria-invalid', 'true')
    }
    expect(screen.getByText('Confirma tu contraseña.')).toBeInTheDocument()
    expect(leerUsuarios()).toEqual(usuariosAntes)
  })

  test('valida el formato de correo y teléfono al registrar', async () => {
    const user = userEvent.setup()
    montarApp('/registro')
    const usuariosAntes = leerUsuarios()
    await completarCampos(user, {
      ...datosCliente,
      'Correo electrónico:': 'lucia.example.com',
      'Teléfono:': '9123a5678',
      'Contraseña:': 'Demo2',
      'Confirmar contraseña:': 'Demo2',
    })
    await user.click(screen.getByRole('button', { name: 'Registrarse' }))

    expect(screen.getByText('Ingresa un correo electrónico válido.')).toBeInTheDocument()
    expect(screen.getByText('Ingresa un teléfono válido de 9 dígitos.')).toBeInTheDocument()
    expect(leerUsuarios()).toEqual(usuariosAntes)
  })

  test.each([
    ['abc', 'abc', 'La contraseña debe tener entre 4 y 10 caracteres.'],
    ['12345678901', '12345678901', 'La contraseña debe tener entre 4 y 10 caracteres.'],
    ['Demo2', 'demo2', 'Las contraseñas no coinciden.'],
  ])('rechaza la contraseña o confirmación inválida (%#)', async (password, confirmar, mensaje) => {
    const user = userEvent.setup()
    montarApp('/registro')
    const usuariosAntes = leerUsuarios()
    await completarCampos(user, { ...datosCliente, 'Contraseña:': password, 'Confirmar contraseña:': confirmar })
    await user.click(screen.getByRole('button', { name: 'Registrarse' }))

    expect(screen.getByText(mensaje)).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    expect(leerUsuarios()).toEqual(usuariosAntes)
  })
})

describe('Administración de cuentas', () => {
  test('exige dirección y contraseña al crear, guarda la contraseña y mantiene las cuatro columnas', async () => {
    const user = userEvent.setup()
    montarApp('/admin/usuarios/nuevo')
    const usuariosAntes = leerUsuarios()
    await completarCampos(user, datosCliente)
    await user.click(screen.getByRole('button', { name: 'Guardar usuario' }))
    expect(screen.getByLabelText('Dirección:')).toBeRequired()
    expect(screen.getByLabelText('Dirección:')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('Contraseña:')).toHaveAttribute('aria-invalid', 'true')
    expect(leerUsuarios()).toEqual(usuariosAntes)

    await completarCampos(user, { 'Dirección:': 'Calle de Prueba 123', 'Contraseña:': ' Demo2 ' })
    await user.click(screen.getByRole('button', { name: 'Guardar usuario' }))

    expect(screen.getByRole('status')).toHaveTextContent('Registro de Lucía Vega agregado correctamente.')
    expect(leerUsuarios()).toContainEqual(expect.objectContaining({ correo: 'lucia@example.com', password: ' Demo2 ' }))
    const listado = screen.getByRole('table')
    expect(within(listado).getAllByRole('columnheader').map((columna) => columna.textContent))
      .toEqual(['Nombre', 'Correo', 'Teléfono', 'Acción'])
    expect(listado).not.toHaveTextContent('Demo2')
  })

  test('permite vaciar la dirección al editar y conserva la contraseña oculta', async () => {
    const user = userEvent.setup()
    const cuenta = { ...usuarioAntiguo, password: ' Demo2 ' }
    localStorage.setItem(claveUsuarios, JSON.stringify([cuenta]))
    const { container } = montarApp('/admin/usuarios/12/editar')
    expect(screen.queryByLabelText('Contraseña:')).not.toBeInTheDocument()
    expect(container.innerHTML).not.toContain('Demo2')

    const direccion = screen.getByLabelText('Dirección:')
    expect(direccion).not.toBeRequired()
    await user.clear(direccion)
    await user.clear(screen.getByLabelText('Nombre:'))
    await completarCampos(user, { 'Nombre:': 'Hernán' })
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(screen.getByRole('status')).toHaveTextContent('Registro de Hernán Lagos actualizado correctamente.')
    expect(leerUsuarios()).toEqual([{ ...cuenta, nombre: 'Hernán', correo: 'hugo@example.com', direccion: '' }])
  })

  test('mantiene disponible la eliminación de cuentas desde el listado', async () => {
    const user = userEvent.setup()
    montarApp('/admin/usuarios')
    const restantes = leerUsuarios().filter(({ id }) => id !== 1)

    const fila = screen.getByRole('row', { name: /Ana Torres/ })
    await user.click(within(fila).getByRole('button', { name: 'Eliminar' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Eliminar usuario' }))

    expect(screen.queryByRole('row', { name: /Ana Torres/ })).not.toBeInTheDocument()
    expect(leerUsuarios()).toEqual(restantes)
  })
})

describe('Carga y migración de cuentas', () => {
  test('guarda credenciales ficticias válidas para los cinco usuarios iniciales', () => {
    montarApp('/admin/usuarios')
    const usuarios = leerUsuarios()
    expect(usuarios.map(({ correo, password }) => [correo, password])).toEqual([
      ['ana.torres@example.com', 'AnaDemo2'],
      ['diego.morales@example.com', 'DiegoDemo2'],
      ['camila.rojas@example.com', 'CamiDemo2'],
      ['felipe.soto@example.com', 'FeliDemo2'],
      ['valentina.perez@example.com', 'ValeDemo2'],
    ])
    expect(usuarios.every(({ password }) => validarPassword(password) === '')).toBe(true)
  })

  test('migra solo las cuentas antiguas sin alterar sus datos ni volver a escribir en la recarga', () => {
    const cuentaExistente = { ...usuarioAntiguo, id: 13, correo: 'otra@example.com', direccion: '', password: ' Demo2 ' }
    localStorage.setItem(claveUsuarios, JSON.stringify([usuarioAntiguo, cuentaExistente]))
    const guardar = vi.spyOn(Storage.prototype, 'setItem')
    const app = montarApp('/admin/usuarios')

    expect(screen.getAllByRole('row')).toHaveLength(3)
    expect(leerUsuarios()).toEqual([{ ...usuarioAntiguo, password: 'Temporal2' }, cuentaExistente])
    expect(guardar.mock.calls.filter(([clave]) => clave === claveUsuarios)).toHaveLength(1)
    const serializado = localStorage.getItem(claveUsuarios)

    app.unmount()
    montarApp('/admin/usuarios')
    expect(localStorage.getItem(claveUsuarios)).toBe(serializado)
    expect(guardar.mock.calls.filter(([clave]) => clave === claveUsuarios)).toHaveLength(1)
  })

  test.each([
    ['JSON inválido', '[{"id":'],
    ['un registro inválido junto a uno antiguo', JSON.stringify([usuarioAntiguo, { ...usuarioAntiguo, id: 13, correo: 'otra@example.com', password: 1234 }])],
  ])('conserva el almacenamiento si contiene %s', (_caso, contenido) => {
    localStorage.setItem(claveUsuarios, contenido)
    montarApp('/admin/usuarios')

    expect(screen.getByRole('status')).toHaveTextContent('Los datos guardados de usuarios no son válidos.')
    expect(screen.getByRole('row', { name: /Ana Torres/ })).toBeInTheDocument()
    expect(localStorage.getItem(claveUsuarios)).toBe(contenido)
  })

  test('conserva los registros originales si falla la escritura y migra al recuperar el almacenamiento', () => {
    const contenido = JSON.stringify([usuarioAntiguo])
    localStorage.setItem(claveUsuarios, contenido)
    const guardarOriginal = Storage.prototype.setItem
    const guardar = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (clave, valor) {
      if (clave === claveUsuarios) throw new DOMException('Cuota superada', 'QuotaExceededError')
      guardarOriginal.call(this, clave, valor)
    })
    const app = montarApp('/admin/usuarios')

    expect(screen.getByRole('status')).toHaveTextContent('El almacenamiento local de usuarios no está disponible.')
    expect(screen.getByRole('row', { name: /Hugo Lagos/ })).toBeInTheDocument()
    expect(localStorage.getItem(claveUsuarios)).toBe(contenido)

    app.unmount()
    guardar.mockRestore()
    montarApp('/admin/usuarios')
    expect(leerUsuarios()).toEqual([{ ...usuarioAntiguo, password: 'Temporal2' }])
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
