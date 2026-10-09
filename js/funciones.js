function passwordValida(password) {
  return password.length >= 4 && password.length <= 10;
}

function telefonoValido(telefono) {
  return telefono.length === 9 && !isNaN(telefono);
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
