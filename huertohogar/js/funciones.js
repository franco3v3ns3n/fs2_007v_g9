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
                        <a href="detalle-producto.html?codigo=${producto.codigo}" class="btn btn-primary">Ver detalle</a>
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
            </div>
        </div>
    `;
}

mostrarProductos();
mostrarDetalleProducto();
