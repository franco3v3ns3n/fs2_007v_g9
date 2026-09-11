console.log("JavaScript cargado");

const productos = [
    {
        codigo: "FR001",
        nombre: "Manzanas Fuji",
        categoria: "Frutas Frescas",
        precio: 1200,
        unidad: "kilo",
        stock: 150,
        descripcion: "Manzanas crujientes y dulces del Valle del Maule, de textura firme y sabor equilibrado entre dulce y ácido.",
        imagen: "img/manzanas-fuji.jpg"
    },
    {
        codigo: "FR002",
        nombre: "Naranjas Valencia",
        categoria: "Frutas Frescas",
        precio: 1000,
        unidad: "kilo",
        stock: 200,
        descripcion: "Naranjas jugosas, ricas en vitamina C e indicadas para preparar zumos frescos.",
        imagen: "img/hero-huertohogar.jpg"
    },
    {
        codigo: "FR003",
        nombre: "Plátanos Cavendish",
        categoria: "Frutas Frescas",
        precio: 800,
        unidad: "kilo",
        stock: 250,
        descripcion: "Plátanos maduros y dulces, ricos en potasio y vitaminas.",
        imagen: "img/hero-huertohogar.jpg"
    },
    {
        codigo: "VR001",
        nombre: "Zanahorias Orgánicas",
        categoria: "Verduras Orgánicas",
        precio: 900,
        unidad: "kilo",
        stock: 100,
        descripcion: "Zanahorias de la Región de O'Higgins, cultivadas sin pesticidas, fuente de vitamina A y fibra.",
        imagen: "img/zanahorias-organicas.jpg"
    },
    {
        codigo: "VR002",
        nombre: "Espinacas Frescas",
        categoria: "Verduras Orgánicas",
        precio: 700,
        unidad: "bolsa de 500 g",
        stock: 80,
        descripcion: "Espinacas frescas y nutritivas, cultivadas bajo prácticas orgánicas.",
        imagen: "img/hero-huertohogar.jpg"
    },
    {
        codigo: "VR003",
        nombre: "Pimientos Tricolores",
        categoria: "Verduras Orgánicas",
        precio: 1500,
        unidad: "kilo",
        stock: 120,
        descripcion: "Pimientos rojos, amarillos y verdes, ricos en antioxidantes y vitaminas.",
        imagen: "img/hero-huertohogar.jpg"
    },
    {
        codigo: "PO001",
        nombre: "Miel Orgánica",
        categoria: "Productos Orgánicos",
        precio: 5000,
        unidad: "frasco de 500 g",
        stock: 50,
        descripcion: "Miel pura y orgánica producida por apicultores locales.",
        imagen: "img/miel-organica.jpg"
    }
];


let carrito = [];

const carritoGuardado = localStorage.getItem("carrito");

if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
}

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarAlCarrito(codigo) {
    const producto = productos.find(function(producto) {
        return producto.codigo === codigo;
    });
    if (!producto) {
        return;
    }
    const item = carrito.find(function(item) {
        return item.codigo === codigo;
    });
    if (item) {
        item.cantidad += 1;
    } else {
        carrito.push({ codigo: codigo, cantidad: 1 });
    }
    guardarCarrito();
    actualizarContadorCarrito();
    mostrarCarrito();
}

function cambiarCantidad(codigo, cambio) {
    const item = carrito.find(function(item) {
        return item.codigo === codigo;
    });
    if (!item || (cambio !== 1 && cambio !== -1)) {
        return;
    }
    if (item.cantidad + cambio >= 1) {
        item.cantidad += cambio;
    }
    guardarCarrito();
    mostrarCarrito();
    actualizarContadorCarrito();
}

function eliminarDelCarrito(codigo) {
    carrito = carrito.filter(function(item) {
        return item.codigo !== codigo;
    });
    guardarCarrito();
    mostrarCarrito();
    actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
    const contador = document.getElementById("contadorCarrito");
    if (!contador) {
        return;
    }
    let cantidadTotal = 0;
    carrito.forEach(function(item) {
        cantidadTotal += item.cantidad;
    });
    contador.textContent = cantidadTotal;
}

function mostrarCarrito() {
    const lista = document.getElementById("listaCarrito");
    if (!lista) {
        return;
    }
    const resumen = document.getElementById("resumenCarrito");
    if (!resumen) {
        return;
    }
    if (carrito.length === 0) {
        lista.innerHTML = `
            <p>Tu carrito está vacío.</p>
            <a href="productos.html" class="btn btn-primary">Ver productos</a>
        `;
        resumen.textContent = "";
        return;
    }
    let contenido = "";
    let total = 0;
    carrito.forEach(function(item) {
        const producto = productos.find(function(producto) {
            return producto.codigo === item.codigo;
        });
        const subtotal = producto.precio * item.cantidad;
        total += subtotal;
        contenido += `
            <article class="card mb-3">
                <div class="card-body">
                    <h2 class="h4">${producto.nombre}</h2>
                    <p>Precio unitario: $${producto.precio.toLocaleString("es-CL")} por ${producto.unidad}</p>
                    <p>Cantidad: ${item.cantidad}</p>
                    <p class="fw-bold">Subtotal: $${subtotal.toLocaleString("es-CL")}</p>
                    <div class="d-flex flex-wrap gap-2">
                        <button type="button" class="btn btn-primary" onclick="cambiarCantidad('${item.codigo}', -1)">-</button>
                        <button type="button" class="btn btn-primary" onclick="cambiarCantidad('${item.codigo}', 1)">+</button>
                        <button type="button" class="btn btn-outline-danger" onclick="eliminarDelCarrito('${item.codigo}')">Eliminar</button>
                    </div>
                </div>
            </article>
        `;
    });
    lista.innerHTML = contenido;
    resumen.textContent = "Total: $" + total.toLocaleString("es-CL");
}

function mostrarProductos() {
    const contenedor = document.getElementById("listaProductos");
    if (!contenedor) {
        return;
    }

    let tarjetas = "";
    productos.forEach(function(producto) {
        let textoImagen = producto.nombre;
        if (producto.imagen === "img/hero-huertohogar.jpg") {
            textoImagen = "Imagen de referencia de HuertoHogar";
        }

        tarjetas += `
            <div class="col-md-4">
                <article class="card h-100">
                    <img src="${producto.imagen}" class="card-img-top" alt="${textoImagen}">
                    <div class="card-body">
                        <p class="texto-secundario mb-2">${producto.categoria}</p>
                        <h2 class="card-title h4">${producto.nombre}</h2>
                        <p class="fw-bold">$${producto.precio.toLocaleString("es-CL")} por ${producto.unidad}</p>
                        <div class="d-flex flex-wrap gap-2">
                            <a href="detalle-producto.html?codigo=${producto.codigo}" class="btn btn-primary">Ver detalle</a>
                            <button type="button" class="btn btn-primary" onclick="agregarAlCarrito('${producto.codigo}')">Añadir al carrito</button>
                        </div>
                    </div>
                </article>
            </div>
        `;
    });
    contenedor.innerHTML = tarjetas;
}

function mostrarDetalleProducto() {
    const contenedor = document.getElementById("detalleProducto");
    if (!contenedor) {
        return;
    }

    const parametros = new URLSearchParams(window.location.search);
    const codigo = parametros.get("codigo");
    let productoEncontrado = null;

    productos.forEach(function(producto) {
        if (producto.codigo === codigo) {
            productoEncontrado = producto;
        }
    });

    if (!productoEncontrado) {
        contenedor.textContent = "Producto no encontrado.";
        return;
    }

    let textoImagen = productoEncontrado.nombre;
    if (productoEncontrado.imagen === "img/hero-huertohogar.jpg") {
        textoImagen = "Imagen de referencia de HuertoHogar";
    }

    let unidadStock = "kilos";
    if (productoEncontrado.unidad === "bolsa de 500 g") {
        unidadStock = "bolsas de 500 g";
    } else if (productoEncontrado.unidad === "frasco de 500 g") {
        unidadStock = "frascos de 500 g";
    }

    contenedor.innerHTML = `
        <div class="row align-items-center g-4">
            <div class="col-md-6">
                <img src="${productoEncontrado.imagen}" class="img-fluid imagen-detalle rounded" alt="${textoImagen}">
            </div>
            <div class="col-md-6">
                <p class="texto-secundario">Código: ${productoEncontrado.codigo}</p>
                <p class="texto-secundario">${productoEncontrado.categoria}</p>
                <h2>${productoEncontrado.nombre}</h2>
                <p class="fw-bold">$${productoEncontrado.precio.toLocaleString("es-CL")} por ${productoEncontrado.unidad}</p>
                <p>Stock disponible: ${productoEncontrado.stock} ${unidadStock}.</p>
                <p>${productoEncontrado.descripcion}</p>
                <button type="button" class="btn btn-primary" onclick="agregarAlCarrito('${productoEncontrado.codigo}')">Añadir al carrito</button>
            </div>
        </div>
    `;
}

function dominioPermitido(correo) {
    return correo.endsWith("@duoc.cl") ||
        correo.endsWith("@profesor.duoc.cl") ||
        correo.endsWith("@gmail.com");
}

function validarLogin() {
    const form = document.getElementById("formLogin");
    if (!form) {
        return;
    }

    form.addEventListener("submit", function(e) {
        e.preventDefault();
        const correo = document.getElementById("correoLogin").value.trim();
        const contrasena = document.getElementById("contrasenaLogin").value;
        const mensaje = document.getElementById("mensajeLogin");

        if (correo === "") {
            mensaje.textContent = "Ingrese su correo.";
            return;
        }
        if (correo.length > 100) {
            mensaje.textContent = "El correo no puede superar los 100 caracteres.";
            return;
        }
        if (!dominioPermitido(correo)) {
            mensaje.textContent = "El correo no pertenece a un dominio permitido.";
            return;
        }
        if (contrasena.trim() === "") {
            mensaje.textContent = "Ingrese su contraseña.";
            return;
        }
        if (contrasena.length < 4 || contrasena.length > 10) {
            mensaje.textContent = "La contraseña debe tener entre 4 y 10 caracteres.";
            return;
        }
        mensaje.textContent = "Datos correctos.";
    });
}

function validarContacto() {
    const form = document.getElementById("formContacto");
    if (!form) {
        return;
    }

    form.addEventListener("submit", function(e) {
        e.preventDefault();
        const nombre = document.getElementById("nombreContacto").value.trim();
        const correo = document.getElementById("correoContacto").value.trim();
        const comentario = document.getElementById("comentarioContacto").value.trim();
        const mensaje = document.getElementById("mensajeContacto");

        if (nombre === "") {
            mensaje.textContent = "Ingrese su nombre.";
            return;
        }
        if (nombre.length > 100) {
            mensaje.textContent = "El nombre no puede superar los 100 caracteres.";
            return;
        }
        if (correo !== "") {
            if (correo.length > 100) {
                mensaje.textContent = "El correo no puede superar los 100 caracteres.";
                return;
            }
            if (!dominioPermitido(correo)) {
                mensaje.textContent = "El correo no pertenece a un dominio permitido.";
                return;
            }
        }
        if (comentario === "") {
            mensaje.textContent = "Ingrese su comentario.";
            return;
        }
        if (comentario.length > 500) {
            mensaje.textContent = "El comentario no puede superar los 500 caracteres.";
            return;
        }
        mensaje.textContent = "Mensaje enviado correctamente.";
    });
}

function validarRun(run) {
    if (run.length < 7 || run.length > 9) {
        return false;
    }
    if (run.includes(".") || run.includes("-")) {
        return false;
    }

    const cuerpo = run.slice(0, -1);
    const digitoIngresado = run.slice(-1).toUpperCase();
    let suma = 0;
    let multiplicador = 2;

    // Recorrer el cuerpo de derecha a izquierda, con factores del 2 al 7.
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        if (cuerpo[i] < "0" || cuerpo[i] > "9") {
            return false;
        }
        suma += Number(cuerpo[i]) * multiplicador;
        multiplicador += 1;
        if (multiplicador > 7) {
            multiplicador = 2;
        }
    }

    const resultado = 11 - (suma % 11);
    let digitoCalculado = String(resultado);
    if (resultado === 11) {
        digitoCalculado = "0";
    } else if (resultado === 10) {
        digitoCalculado = "K";
    }
    return digitoCalculado === digitoIngresado;
}

function validarRegistro() {
    const form = document.getElementById("formRegistro");
    if (!form) {
        return;
    }

    form.addEventListener("submit", function(e) {
        e.preventDefault();
        const run = document.getElementById("runRegistro").value.trim();
        const nombre = document.getElementById("nombreRegistro").value.trim();
        const apellidos = document.getElementById("apellidosRegistro").value.trim();
        const correo = document.getElementById("correoRegistro").value.trim();
        const direccion = document.getElementById("direccionRegistro").value.trim();
        const mensaje = document.getElementById("mensajeRegistro");

        if (run === "") {
            mensaje.textContent = "Ingrese su RUN.";
            return;
        }
        if (!validarRun(run)) {
            mensaje.textContent = "El RUN ingresado no es válido.";
            return;
        }
        if (nombre === "") {
            mensaje.textContent = "Ingrese su nombre.";
            return;
        }
        if (nombre.length > 50) {
            mensaje.textContent = "El nombre no puede superar los 50 caracteres.";
            return;
        }
        if (apellidos === "") {
            mensaje.textContent = "Ingrese sus apellidos.";
            return;
        }
        if (apellidos.length > 100) {
            mensaje.textContent = "Los apellidos no pueden superar los 100 caracteres.";
            return;
        }
        if (correo === "") {
            mensaje.textContent = "Ingrese su correo.";
            return;
        }
        if (correo.length > 100) {
            mensaje.textContent = "El correo no puede superar los 100 caracteres.";
            return;
        }
        if (!dominioPermitido(correo)) {
            mensaje.textContent = "El correo no pertenece a un dominio permitido.";
            return;
        }
        if (direccion === "") {
            mensaje.textContent = "Ingrese su dirección.";
            return;
        }
        if (direccion.length > 300) {
            mensaje.textContent = "La dirección no puede superar los 300 caracteres.";
            return;
        }
        mensaje.textContent = "Registro válido.";
    });
}

function cargarRegiones() {
    const regionSelect = document.getElementById("regionRegistro");
    if (!regionSelect) {
        return;
    }

    regionSelect.innerHTML = '<option value="">Seleccione una región</option>';
    for (const region of regiones) {
        regionSelect.innerHTML += `<option value="${region.nombre}">${region.nombre}</option>`;
    }

    regionSelect.addEventListener("change", cargarComunas);
}

function cargarComunas() {
    const regionSelect = document.getElementById("regionRegistro");
    const comunaSelect = document.getElementById("comunaRegistro");
    if (!regionSelect || !comunaSelect) {
        return;
    }

    comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';
    const regionSeleccionada = regiones.find(function(region) {
        return region.nombre === regionSelect.value;
    });
    if (!regionSeleccionada) {
        return;
    }
    for (const comuna of regionSeleccionada.comunas) {
        comunaSelect.innerHTML += `<option value="${comuna}">${comuna}</option>`;
    }
}

mostrarProductos();
mostrarDetalleProducto();
mostrarCarrito();
actualizarContadorCarrito();
validarLogin();
validarContacto();
validarRegistro();
cargarRegiones();
