function passwordValida(password) {
  return password.length >= 4 && password.length <= 10;
}

function telefonoValido(telefono) {
  if (telefono.length !== 9) return false;

  for (const digito of telefono) {
    if (!"0123456789".includes(digito)) return false;
  }

  return true;
}

const formContacto = document.getElementById("formContacto");

if (formContacto) {
  formContacto.addEventListener("submit", function (event) {
    event.preventDefault();

    const nombre = document.getElementById("nombreContacto").value.trim();
    const correo = document.getElementById("correoContacto").value.trim();
    const comentario = document.getElementById("comentarioContacto").value.trim();
    const errorNombre = document.getElementById("errorNombreContacto");
    const errorCorreo = document.getElementById("errorCorreoContacto");
    const errorComentario = document.getElementById("errorComentarioContacto");
    const mensaje = document.getElementById("mensajeContacto");
    let formularioValido = true;

    errorNombre.textContent = "";
    errorCorreo.textContent = "";
    errorComentario.textContent = "";
    mensaje.textContent = "";

    if (nombre === "") {
      errorNombre.textContent = "Ingresa tu nombre.";
      formularioValido = false;
    }

    if (correo === "") {
      errorCorreo.textContent = "Ingresa tu correo electrónico.";
      formularioValido = false;
    } else if (!correo.includes("@")) {
      errorCorreo.textContent = "Ingresa un correo electrónico válido.";
      formularioValido = false;
    }

    if (comentario === "") {
      errorComentario.textContent = "Ingresa un comentario.";
      formularioValido = false;
    }

    if (formularioValido) {
      mensaje.textContent = "Formulario de contacto validado correctamente.";
    }
  });
}

const formLogin = document.getElementById("formLogin");

if (formLogin) {
  formLogin.addEventListener("submit", function (event) {
    event.preventDefault();

    const correo = document.getElementById("correoLogin").value.trim();
    const password = document.getElementById("passwordLogin").value;
    const errorCorreo = document.getElementById("errorCorreoLogin");
    const errorPassword = document.getElementById("errorPasswordLogin");
    const mensaje = document.getElementById("mensajeLogin");
    let formularioValido = true;

    errorCorreo.textContent = "";
    errorPassword.textContent = "";
    mensaje.textContent = "";

    if (correo === "") {
      errorCorreo.textContent = "Ingresa tu correo electrónico.";
      formularioValido = false;
    } else if (!correo.includes("@")) {
      errorCorreo.textContent = "Ingresa un correo electrónico válido.";
      formularioValido = false;
    }

    if (password === "") {
      errorPassword.textContent = "Ingresa tu contraseña.";
      formularioValido = false;
    } else if (!passwordValida(password)) {
      errorPassword.textContent = "La contraseña debe tener entre 4 y 10 caracteres.";
      formularioValido = false;
    }

    if (formularioValido) {
      mensaje.textContent = "Datos de inicio de sesión válidos.";
    }
  });
}

const formRegistro = document.getElementById("formRegistro");

if (formRegistro) {
  formRegistro.addEventListener("submit", function (event) {
    event.preventDefault();

    const nombre = document.getElementById("nombreRegistro").value.trim();
    const apellido = document.getElementById("apellidoRegistro").value.trim();
    const correo = document.getElementById("correoRegistro").value.trim();
    const telefono = document.getElementById("telefonoRegistro").value.trim();
    const password = document.getElementById("passwordRegistro").value;
    const confirmarPassword = document.getElementById("confirmarPasswordRegistro").value;
    const errorNombre = document.getElementById("errorNombreRegistro");
    const errorApellido = document.getElementById("errorApellidoRegistro");
    const errorCorreo = document.getElementById("errorCorreoRegistro");
    const errorTelefono = document.getElementById("errorTelefonoRegistro");
    const errorPassword = document.getElementById("errorPasswordRegistro");
    const errorConfirmarPassword = document.getElementById("errorConfirmarPasswordRegistro");
    const mensaje = document.getElementById("mensajeRegistro");
    let formularioValido = true;

    errorNombre.textContent = "";
    errorApellido.textContent = "";
    errorCorreo.textContent = "";
    errorTelefono.textContent = "";
    errorPassword.textContent = "";
    errorConfirmarPassword.textContent = "";
    mensaje.textContent = "";

    if (nombre === "") {
      errorNombre.textContent = "Ingresa tu nombre.";
      formularioValido = false;
    }

    if (apellido === "") {
      errorApellido.textContent = "Ingresa tu apellido.";
      formularioValido = false;
    }

    if (correo === "") {
      errorCorreo.textContent = "Ingresa tu correo electrónico.";
      formularioValido = false;
    } else if (!correo.includes("@")) {
      errorCorreo.textContent = "Ingresa un correo electrónico válido.";
      formularioValido = false;
    }

    if (telefono === "") {
      errorTelefono.textContent = "Ingresa tu teléfono.";
      formularioValido = false;
    } else if (!telefonoValido(telefono)) {
      errorTelefono.textContent = "Ingresa un teléfono válido de 9 dígitos.";
      formularioValido = false;
    }

    if (password === "") {
      errorPassword.textContent = "Ingresa tu contraseña.";
      formularioValido = false;
    } else if (!passwordValida(password)) {
      errorPassword.textContent = "La contraseña debe tener entre 4 y 10 caracteres.";
      formularioValido = false;
    }

    if (confirmarPassword === "") {
      errorConfirmarPassword.textContent = "Confirma tu contraseña.";
      formularioValido = false;
    } else if (confirmarPassword !== password) {
      errorConfirmarPassword.textContent = "Las contraseñas no coinciden.";
      formularioValido = false;
    }

    if (formularioValido) {
      mensaje.textContent = "Formulario de registro validado correctamente.";
    }
  });
}

const formNuevoProducto = document.getElementById("formNuevoProducto");

if (formNuevoProducto) {
  formNuevoProducto.addEventListener("submit", function (event) {
    event.preventDefault();

    const codigo = document.getElementById("codigoNuevoProducto").value.trim();
    const nombre = document.getElementById("nombreNuevoProducto").value.trim();
    const categoria = document.getElementById("categoriaNuevoProducto").value.trim();
    const precio = document.getElementById("precioNuevoProducto").value.trim();
    const stock = document.getElementById("stockNuevoProducto").value.trim();
    const descripcion = document.getElementById("descripcionNuevoProducto").value.trim();
    const errorCodigo = document.getElementById("errorCodigoNuevoProducto");
    const errorNombre = document.getElementById("errorNombreNuevoProducto");
    const errorCategoria = document.getElementById("errorCategoriaNuevoProducto");
    const errorPrecio = document.getElementById("errorPrecioNuevoProducto");
    const errorStock = document.getElementById("errorStockNuevoProducto");
    const errorDescripcion = document.getElementById("errorDescripcionNuevoProducto");
    const mensaje = document.getElementById("mensajeNuevoProducto");
    let formularioValido = true;

    errorCodigo.textContent = "";
    errorNombre.textContent = "";
    errorCategoria.textContent = "";
    errorPrecio.textContent = "";
    errorStock.textContent = "";
    errorDescripcion.textContent = "";
    mensaje.textContent = "";

    if (codigo === "") {
      errorCodigo.textContent = "Ingresa el código del producto.";
      formularioValido = false;
    }

    if (nombre === "") {
      errorNombre.textContent = "Ingresa el nombre del producto.";
      formularioValido = false;
    }

    if (categoria === "") {
      errorCategoria.textContent = "Selecciona una categoría.";
      formularioValido = false;
    }

    if (precio === "" || isNaN(Number(precio)) || Number(precio) <= 0) {
      errorPrecio.textContent = "Ingresa un precio válido mayor que 0.";
      formularioValido = false;
    }

    if (stock === "" || isNaN(Number(stock)) || Number(stock) < 0) {
      errorStock.textContent = "Ingresa un stock válido igual o mayor que 0.";
      formularioValido = false;
    }

    if (descripcion === "") {
      errorDescripcion.textContent = "Ingresa la descripción del producto.";
      formularioValido = false;
    }

    if (formularioValido) {
      mensaje.textContent = "Formulario de nuevo producto validado correctamente.";
    }
  });
}

const formEditarProducto = document.getElementById("formEditarProducto");

if (formEditarProducto) {
  formEditarProducto.addEventListener("submit", function (event) {
    event.preventDefault();

    const codigo = document.getElementById("codigoEditarProducto").value.trim();
    const nombre = document.getElementById("nombreEditarProducto").value.trim();
    const categoria = document.getElementById("categoriaEditarProducto").value.trim();
    const precio = document.getElementById("precioEditarProducto").value.trim();
    const stock = document.getElementById("stockEditarProducto").value.trim();
    const descripcion = document.getElementById("descripcionEditarProducto").value.trim();
    const errorCodigo = document.getElementById("errorCodigoEditarProducto");
    const errorNombre = document.getElementById("errorNombreEditarProducto");
    const errorCategoria = document.getElementById("errorCategoriaEditarProducto");
    const errorPrecio = document.getElementById("errorPrecioEditarProducto");
    const errorStock = document.getElementById("errorStockEditarProducto");
    const errorDescripcion = document.getElementById("errorDescripcionEditarProducto");
    const mensaje = document.getElementById("mensajeEditarProducto");
    let formularioValido = true;

    errorCodigo.textContent = "";
    errorNombre.textContent = "";
    errorCategoria.textContent = "";
    errorPrecio.textContent = "";
    errorStock.textContent = "";
    errorDescripcion.textContent = "";
    mensaje.textContent = "";

    if (codigo === "") {
      errorCodigo.textContent = "Ingresa el código del producto.";
      formularioValido = false;
    }

    if (nombre === "") {
      errorNombre.textContent = "Ingresa el nombre del producto.";
      formularioValido = false;
    }

    if (categoria === "") {
      errorCategoria.textContent = "Selecciona una categoría.";
      formularioValido = false;
    }

    if (precio === "" || isNaN(Number(precio)) || Number(precio) <= 0) {
      errorPrecio.textContent = "Ingresa un precio válido mayor que 0.";
      formularioValido = false;
    }

    if (stock === "" || isNaN(Number(stock)) || Number(stock) < 0) {
      errorStock.textContent = "Ingresa un stock válido igual o mayor que 0.";
      formularioValido = false;
    }

    if (descripcion === "") {
      errorDescripcion.textContent = "Ingresa la descripción del producto.";
      formularioValido = false;
    }

    if (formularioValido) {
      mensaje.textContent = "Formulario de edición de producto validado correctamente.";
    }
  });
}

const formNuevoUsuario = document.getElementById("formNuevoUsuario");

if (formNuevoUsuario) {
  formNuevoUsuario.addEventListener("submit", function (event) {
    event.preventDefault();

    const nombre = document.getElementById("nombreNuevoUsuario").value.trim();
    const apellido = document.getElementById("apellidoNuevoUsuario").value.trim();
    const correo = document.getElementById("correoNuevoUsuario").value.trim();
    const telefono = document.getElementById("telefonoNuevoUsuario").value.trim();
    const direccion = document.getElementById("direccionNuevoUsuario").value.trim();
    const password = document.getElementById("passwordNuevoUsuario").value;
    const errorNombre = document.getElementById("errorNombreNuevoUsuario");
    const errorApellido = document.getElementById("errorApellidoNuevoUsuario");
    const errorCorreo = document.getElementById("errorCorreoNuevoUsuario");
    const errorTelefono = document.getElementById("errorTelefonoNuevoUsuario");
    const errorDireccion = document.getElementById("errorDireccionNuevoUsuario");
    const errorPassword = document.getElementById("errorPasswordNuevoUsuario");
    const mensaje = document.getElementById("mensajeNuevoUsuario");
    let formularioValido = true;

    errorNombre.textContent = "";
    errorApellido.textContent = "";
    errorCorreo.textContent = "";
    errorTelefono.textContent = "";
    errorDireccion.textContent = "";
    errorPassword.textContent = "";
    mensaje.textContent = "";

    if (nombre === "") {
      errorNombre.textContent = "Ingresa el nombre.";
      formularioValido = false;
    }

    if (apellido === "") {
      errorApellido.textContent = "Ingresa el apellido.";
      formularioValido = false;
    }

    if (correo === "") {
      errorCorreo.textContent = "Ingresa el correo electrónico.";
      formularioValido = false;
    } else if (!correo.includes("@")) {
      errorCorreo.textContent = "Ingresa un correo electrónico válido.";
      formularioValido = false;
    }

    if (telefono === "") {
      errorTelefono.textContent = "Ingresa el teléfono.";
      formularioValido = false;
    } else if (!telefonoValido(telefono)) {
      errorTelefono.textContent = "Ingresa un teléfono válido de 9 dígitos.";
      formularioValido = false;
    }

    if (direccion === "") {
      errorDireccion.textContent = "Ingresa la dirección.";
      formularioValido = false;
    }

    if (password === "") {
      errorPassword.textContent = "Ingresa la contraseña.";
      formularioValido = false;
    } else if (!passwordValida(password)) {
      errorPassword.textContent = "La contraseña debe tener entre 4 y 10 caracteres.";
      formularioValido = false;
    }

    if (formularioValido) {
      mensaje.textContent = "Formulario de nuevo usuario validado correctamente.";
    }
  });
}

const formEditarUsuario = document.getElementById("formEditarUsuario");

if (formEditarUsuario) {
  formEditarUsuario.addEventListener("submit", function (event) {
    event.preventDefault();

    const nombre = document.getElementById("nombreEditarUsuario").value.trim();
    const apellido = document.getElementById("apellidoEditarUsuario").value.trim();
    const correo = document.getElementById("correoEditarUsuario").value.trim();
    const telefono = document.getElementById("telefonoEditarUsuario").value.trim();
    const direccion = document.getElementById("direccionEditarUsuario").value.trim();
    const errorNombre = document.getElementById("errorNombreEditarUsuario");
    const errorApellido = document.getElementById("errorApellidoEditarUsuario");
    const errorCorreo = document.getElementById("errorCorreoEditarUsuario");
    const errorTelefono = document.getElementById("errorTelefonoEditarUsuario");
    const errorDireccion = document.getElementById("errorDireccionEditarUsuario");
    const mensaje = document.getElementById("mensajeEditarUsuario");
    let formularioValido = true;

    errorNombre.textContent = "";
    errorApellido.textContent = "";
    errorCorreo.textContent = "";
    errorTelefono.textContent = "";
    errorDireccion.textContent = "";
    mensaje.textContent = "";

    if (nombre === "") {
      errorNombre.textContent = "Ingresa el nombre.";
      formularioValido = false;
    }

    if (apellido === "") {
      errorApellido.textContent = "Ingresa el apellido.";
      formularioValido = false;
    }

    if (correo === "") {
      errorCorreo.textContent = "Ingresa el correo electrónico.";
      formularioValido = false;
    } else if (!correo.includes("@")) {
      errorCorreo.textContent = "Ingresa un correo electrónico válido.";
      formularioValido = false;
    }

    if (telefono === "") {
      errorTelefono.textContent = "Ingresa el teléfono.";
      formularioValido = false;
    } else if (!telefonoValido(telefono)) {
      errorTelefono.textContent = "Ingresa un teléfono válido de 9 dígitos.";
      formularioValido = false;
    }

    if (direccion === "") {
      errorDireccion.textContent = "Ingresa la dirección.";
      formularioValido = false;
    }

    if (formularioValido) {
      mensaje.textContent = "Formulario de edición de usuario validado correctamente.";
    }
  });
}
