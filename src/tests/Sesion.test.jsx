import { StrictMode } from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Link, MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, test } from 'vitest'
import App from '../App'

const claveSesion = 'huertohogar-sesion-v1'
const claveUsuarios = 'huertohogar-usuarios-v1'
const claveCarrito = 'huertohogar-carrito-v1'
const admin = { correo: 'admin@huertohogar.cl', password: 'AdminDemo2' }
const errorCredenciales = 'Correo electrónico o contraseña incorrectos.'

function montarApp(ruta) {
  return render(
    <StrictMode>
      <MemoryRouter initialEntries={[ruta]}>
        <Link to="/login">Abrir formulario de acceso</Link>
        <Link to="/admin/usuarios">Abrir administración de usuarios</Link>
        <App />
      </MemoryRouter>
    </StrictMode>,
  )
}

function leerSesion() {
  return JSON.parse(sessionStorage.getItem(claveSesion))
}

function menu(nombre) {
  return within(screen.getByRole('navigation', { name: nombre }))
}

async function escribirCredenciales(user, correo, password) {
  await user.type(screen.getByLabelText('Correo electrónico:'), correo)
  await user.type(screen.getByLabelText('Contraseña:'), password)
}

async function ingresar(user, correo, password) {
  await escribirCredenciales(user, correo, password)
  await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('Formulario de inicio de sesión', () => {
  test('abre en Cliente y permite cambiar de pestaña con el teclado limpiando campos y errores', async () => {
    const user = userEvent.setup()
    montarApp('/login')
    const cliente = screen.getByRole('tab', { name: 'Cliente' })
    const administrador = screen.getByRole('tab', { name: 'Administrador' })
    expect(cliente).toHaveAttribute('aria-selected', 'true')
    expect(administrador).toHaveAttribute('aria-selected', 'false')
    expect(screen.queryByRole('complementary', { name: 'Credenciales' })).not.toBeInTheDocument()

    await ingresar(user, 'correo-invalido', '123')
    expect(screen.getByLabelText('Correo electrónico:')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('Contraseña:')).toHaveAttribute('aria-invalid', 'true')
    await user.click(cliente)
    await user.keyboard('{ArrowRight}')

    expect(administrador).toHaveFocus()
    expect(administrador).toHaveAttribute('aria-selected', 'true')
    const nota = screen.getByRole('complementary', { name: 'Credenciales' })
    expect(screen.getByRole('heading', { name: 'Inicio de sesión' }).closest('section').nextElementSibling).toBe(nota)
    expect(Array.from(nota.children, (elemento) => elemento.textContent)).toEqual([
      'Credenciales', `Correo: ${admin.correo}`, `Contraseña: ${admin.password}`,
    ])
    for (const etiqueta of ['Correo electrónico:', 'Contraseña:']) {
      expect(screen.getByLabelText(etiqueta)).toHaveValue('')
      expect(screen.getByLabelText(etiqueta)).toHaveAttribute('aria-invalid', 'false')
    }

    await ingresar(user, admin.correo, 'Incorrecta')
    expect(screen.getByRole('alert')).toHaveTextContent(errorCredenciales)
    await user.click(cliente)
    expect(cliente).toHaveAttribute('aria-selected', 'true')
    expect(nota).not.toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Correo electrónico:')).toHaveValue('')
    expect(screen.getByLabelText('Contraseña:')).toHaveValue('')
  })

  test.each([
    ['contraseña con mayúsculas distintas', 'Cliente', 'ana.torres@example.com', 'anademo2'],
    ['cliente inexistente', 'Cliente', 'nodado@example.com', 'AnaDemo2'],
    ['administrador en Cliente', 'Cliente', admin.correo, admin.password],
    ['cliente en Administrador', 'Administrador', 'ana.torres@example.com', 'AnaDemo2'],
  ])('rechaza %s con un mensaje general', async (_caso, tipo, correo, password) => {
    const user = userEvent.setup()
    montarApp('/login')
    await user.click(screen.getByRole('tab', { name: tipo }))
    await ingresar(user, correo, password)

    expect(screen.getByRole('alert')).toHaveTextContent(errorCredenciales)
    expect(screen.getByRole('heading', { name: 'Inicio de sesión' })).toBeInTheDocument()
    expect(leerSesion()).toBeNull()
  })
})

describe('Sesiones de cliente', () => {
  test('autentica a un cliente inicial, restaura su sesión y conserva el carrito al entrar y salir', async () => {
    const user = userEvent.setup()
    const app = montarApp('/productos')
    await user.click(screen.getByRole('button', { name: 'Agregar al carrito: Manzanas Fuji' }))
    const carrito = localStorage.getItem(claveCarrito)
    expect(JSON.parse(carrito)).toEqual([{ codigo: 'FR001', cantidad: 1 }])

    await user.click(menu('Navegación principal').getByRole('link', { name: 'Iniciar sesión' }))
    await ingresar(user, 'ANA.TORRES@EXAMPLE.COM', 'AnaDemo2')
    expect(screen.getByRole('heading', { name: 'Productos frescos del campo a tu hogar' })).toBeInTheDocument()
    expect(menu('Navegación principal').getByText('Hola, Ana')).toBeInTheDocument()
    expect(menu('Navegación principal').queryByRole('link', { name: 'Iniciar sesión' })).not.toBeInTheDocument()
    expect(menu('Navegación principal').queryByRole('link', { name: 'Registro' })).not.toBeInTheDocument()
    expect(leerSesion()).toEqual({ tipo: 'cliente', id: 1 })
    expect(localStorage.getItem(claveCarrito)).toBe(carrito)

    app.unmount()
    montarApp('/productos')
    expect(menu('Navegación principal').getByText('Hola, Ana')).toBeInTheDocument()
    expect(menu('Navegación principal').getByRole('link', { name: 'Carrito (1)' })).toBeInTheDocument()

    await user.click(menu('Navegación principal').getByRole('button', { name: 'Cerrar sesión' }))
    expect(leerSesion()).toBeNull()
    expect(menu('Navegación principal').getByRole('link', { name: 'Iniciar sesión' })).toBeInTheDocument()
    expect(menu('Navegación principal').getByRole('link', { name: 'Registro' })).toBeInTheDocument()
    expect(menu('Navegación principal').getByRole('link', { name: 'Carrito (1)' })).toBeInTheDocument()
    expect(localStorage.getItem(claveCarrito)).toBe(carrito)
  })

  test.each([
    ['registro público', '/registro', 'Registrarse'],
    ['alta administrativa', '/admin/usuarios/nuevo', 'Guardar usuario'],
  ])('autentica a un cliente creado mediante %s con su contraseña exacta', async (_origen, ruta, boton) => {
    const user = userEvent.setup()
    montarApp(ruta)
    await user.type(screen.getByLabelText('Nombre:'), 'Lucía')
    await user.type(screen.getByLabelText('Apellido:'), 'Vega')
    await user.type(screen.getByLabelText('Teléfono:'), '912345678')
    await escribirCredenciales(user, 'lucia@example.com', ' Demo2 ')
    if (ruta === '/registro') {
      await user.type(screen.getByLabelText('Confirmar contraseña:'), ' Demo2 ')
    } else {
      await user.type(screen.getByLabelText('Dirección:'), 'Calle simulada 123')
    }
    await user.click(screen.getByRole('button', { name: boton }))
    await user.click(screen.getByRole('link', { name: 'Abrir formulario de acceso' }))
    await ingresar(user, 'lucia@example.com', 'Demo2')
    expect(screen.getByRole('alert')).toHaveTextContent(errorCredenciales)
    await user.clear(screen.getByLabelText('Contraseña:'))
    await user.type(screen.getByLabelText('Contraseña:'), ' Demo2 ')
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(menu('Navegación principal').getByText('Hola, Lucía')).toBeInTheDocument()
    expect(leerSesion()).toEqual({ tipo: 'cliente', id: 6 })
  })

  test('autentica a un cliente migrado con Temporal2', async () => {
    const user = userEvent.setup()
    const usuario = { id: 12, nombre: 'Hugo', apellido: 'Lagos', correo: 'hugo@example.com', telefono: '978901234', direccion: '' }
    localStorage.setItem(claveUsuarios, JSON.stringify([usuario]))
    montarApp('/login')
    await ingresar(user, 'hugo@example.com', 'Temporal2')

    expect(menu('Navegación principal').getByText('Hola, Hugo')).toBeInTheDocument()
    expect(leerSesion()).toEqual({ tipo: 'cliente', id: 12 })
  })

  test('conserva el ID al editar el correo y elimina la sesión si se borra la cuenta', async () => {
    const user = userEvent.setup()
    sessionStorage.setItem(claveSesion, JSON.stringify({ tipo: 'cliente', id: 1 }))
    const app = montarApp('/admin/usuarios/1/editar')
    const campoCorreo = screen.getByLabelText('Correo electrónico:')
    await user.clear(campoCorreo)
    await user.type(campoCorreo, 'ana.editada@example.com')
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(leerSesion()).toEqual({ tipo: 'cliente', id: 1 })
    expect(screen.getByRole('row', { name: /ana.editada@example.com/ })).toBeInTheDocument()

    app.unmount()
    montarApp('/admin/usuarios')
    expect(menu('Navegación administrativa').getByText('Hola, Ana')).toBeInTheDocument()
    const fila = screen.getByRole('row', { name: /Ana Torres/ })
    await user.click(within(fila).getByRole('button', { name: 'Eliminar' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Eliminar usuario' }))

    expect(leerSesion()).toBeNull()
    expect(menu('Navegación administrativa').queryByRole('button', { name: 'Cerrar sesión' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Administración de usuarios' })).toBeInTheDocument()
    await user.click(menu('Navegación administrativa').getByRole('link', { name: 'Volver a tienda' }))
    expect(menu('Navegación principal').getByRole('link', { name: 'Iniciar sesión' })).toBeInTheDocument()
  })
})

describe('Sesión administrativa y acceso directo', () => {
  test('reemplaza la sesión anterior, abre el panel, persiste en la pestaña y permite salir a la tienda', async () => {
    const user = userEvent.setup()
    sessionStorage.setItem(claveSesion, JSON.stringify({ tipo: 'cliente', id: 1 }))
    const app = montarApp('/login')
    await user.click(screen.getByRole('tab', { name: 'Administrador' }))
    await ingresar(user, admin.correo, admin.password)

    expect(screen.getByRole('heading', { name: 'Administración HuertoHogar' })).toBeInTheDocument()
    expect(leerSesion()).toEqual({ tipo: 'administrador', id: admin.correo })
    expect(menu('Navegación administrativa').queryByText('Hola, Ana')).not.toBeInTheDocument()
    await user.click(menu('Navegación administrativa').getByRole('link', { name: 'Volver a tienda' }))
    expect(menu('Navegación principal').getByText('Administrador')).toBeInTheDocument()
    expect(menu('Navegación principal').queryByRole('link', { name: 'Iniciar sesión' })).not.toBeInTheDocument()

    app.unmount()
    montarApp('/admin')
    expect(menu('Navegación administrativa').getByText('Administrador')).toBeInTheDocument()
    await user.click(menu('Navegación administrativa').getByRole('button', { name: 'Cerrar sesión' }))
    expect(leerSesion()).toBeNull()
    expect(screen.getByRole('heading', { name: 'Productos frescos del campo a tu hogar' })).toBeInTheDocument()
  })

  test.each([
    ['/admin', 'Administración HuertoHogar'],
    ['/admin/productos', 'Administración de productos'],
    ['/admin/productos/nuevo', 'Nuevo producto'],
    ['/admin/productos/FR001/editar', 'Editar producto'],
    ['/admin/usuarios', 'Administración de usuarios'],
    ['/admin/usuarios/nuevo', 'Nuevo usuario'],
    ['/admin/usuarios/1/editar', 'Editar usuario'],
  ])('permite abrir %s como visitante', (ruta, titulo) => {
    montarApp(ruta)
    expect(screen.getByRole('heading', { name: titulo })).toBeInTheDocument()
    expect(menu('Navegación administrativa').queryByRole('button', { name: 'Cerrar sesión' })).not.toBeInTheDocument()
    expect(leerSesion()).toBeNull()
  })

  test.each([
    ['JSON corrupto', '{'],
    ['un ID de cliente inexistente', JSON.stringify({ tipo: 'cliente', id: 999 })],
    ['un ID administrativo distinto', JSON.stringify({ tipo: 'administrador', id: 'otro@example.com' })],
    ['campos adicionales', JSON.stringify({ tipo: 'cliente', id: 1, password: 'Demo2' })],
  ])('descarta una sesión con %s y muestra la tienda como visitante', (_caso, valor) => {
    sessionStorage.setItem(claveSesion, valor)
    montarApp('/')

    expect(sessionStorage.getItem(claveSesion)).toBeNull()
    expect(menu('Navegación principal').getByRole('link', { name: 'Iniciar sesión' })).toBeInTheDocument()
    expect(menu('Navegación principal').queryByRole('button', { name: 'Cerrar sesión' })).not.toBeInTheDocument()
  })
})
