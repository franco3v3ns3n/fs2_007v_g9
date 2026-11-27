package cl.duoc.huertohogar.config;

import cl.duoc.huertohogar.model.InicializacionCatalogo;
import cl.duoc.huertohogar.model.Producto;
import cl.duoc.huertohogar.repository.ProductoRepository;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.SmartInitializingSingleton;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@Profile("dev | prod")
public class CatalogoInicial implements SmartInitializingSingleton {

    private static final String CATALOGO_INICIAL = "catalogo-inicial";

    private final ProductoRepository repository;
    private final EntityManager entityManager;
    private final boolean produccion;

    public CatalogoInicial(ProductoRepository repository, EntityManager entityManager, Environment environment) {
        this.repository = repository;
        this.entityManager = entityManager;
        this.produccion = environment.matchesProfiles("prod");
    }

    @Override
    @Transactional
    public void afterSingletonsInstantiated() {
        if (produccion) {
            if (entityManager.find(InicializacionCatalogo.class, CATALOGO_INICIAL) == null) {
                if (repository.count() == 0) {
                    repository.saveAll(productosIniciales());
                }
                entityManager.persist(new InicializacionCatalogo(CATALOGO_INICIAL));
            }
            return;
        }

        for (Producto producto : productosIniciales()) {
            if (!repository.existsByCodigo(producto.getCodigo())) {
                repository.save(producto);
            }
        }
    }

    private static List<Producto> productosIniciales() {
        return List.of(
                new Producto("FR001", "Manzanas Fuji", "Frutas Frescas", 1200, 150,
                        "Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule. Perfectas para meriendas saludables o como ingrediente en postres. Estas manzanas son conocidas por su textura firme y su sabor equilibrado entre dulce y ácido.",
                        "kilo", "kilos", "Valle del Maule", false,
                        "/img/productos/fr001-manzanas-fuji.webp", false),
                new Producto("FR002", "Naranjas Valencia", "Frutas Frescas", 1000, 200,
                        "Jugosas y ricas en vitamina C, estas naranjas Valencia son ideales para zumos frescos y refrescantes. Cultivadas en condiciones climáticas óptimas que aseguran su dulzura y jugosidad.",
                        "kilo", "kilos", "Valle del Limarí", true,
                        "/img/productos/fr002-naranjas-valencia.webp", false),
                new Producto("FR003", "Plátanos Cavendish", "Frutas Frescas", 800, 250,
                        "Plátanos maduros y dulces, perfectos para el desayuno o como snack energético. Estos plátanos son ricos en potasio y vitaminas, ideales para mantener una dieta equilibrada.",
                        "kilo", "kilos", "Ecuador", true,
                        "/img/productos/fr003-platanos-cavendish.webp", false),
                new Producto("VR001", "Zanahorias Orgánicas", "Verduras Orgánicas", 900, 100,
                        "Zanahorias crujientes cultivadas sin pesticidas en la Región de O'Higgins. Excelente fuente de vitamina A y fibra, ideales para ensaladas, jugos o como snack saludable.",
                        "kilo", "kilos", "Región de O'Higgins", false,
                        "/img/productos/vr001-zanahorias-organicas.webp", false),
                new Producto("VR002", "Espinacas Frescas", "Verduras Orgánicas", 700, 80,
                        "Espinacas frescas y nutritivas, perfectas para ensaladas y batidos verdes. Estas espinacas son cultivadas bajo prácticas orgánicas que garantizan su calidad y valor nutricional.",
                        "bolsa de 500g", "bolsas", "Región del Maule", true,
                        "/img/productos/vr002-espinacas-frescas.webp", false),
                new Producto("VR003", "Pimientos Tricolores", "Verduras Orgánicas", 1500, 120,
                        "Pimientos rojos, amarillos y verdes, ideales para salteados y platos coloridos. Ricos en antioxidantes y vitaminas, estos pimientos añaden un toque vibrante y saludable a cualquier receta.",
                        "kilo", "kilos", "Región de Coquimbo", true,
                        "/img/productos/vr003-pimientos-tricolores.webp", false),
                new Producto("PO001", "Miel Orgánica", "Productos Orgánicos", 5000, 50,
                        "Miel pura y orgánica producida por apicultores locales. Rica en antioxidantes y con un sabor inigualable, perfecta para endulzar de manera natural tus comidas y bebidas.",
                        "frasco de 500g", "frascos", "Región del Biobío", true,
                        "/img/productos/po001-miel-organica.webp", false),
                new Producto("PO003", "Quinua Orgánica", "Productos Orgánicos", 3500, 60,
                        "Quinua orgánica de alta calidad, ideal para ensaladas, acompañamientos y preparaciones saludables. Una alternativa nutritiva y versátil para incorporar a la alimentación diaria.",
                        "bolsa de 500g", "bolsas", "Altiplano de Tarapacá", true,
                        "/img/productos/po003-quinua-organica.webp", false),
                new Producto("PL001", "Leche Entera", "Productos Lácteos", 1200, 100,
                        "Leche entera proveniente de granjas locales, con sabor natural y textura cremosa. Ideal para acompañar desayunos y utilizar en distintas preparaciones.",
                        "litro", "unidades", "Región de Los Lagos", true,
                        "/img/productos/pl001-leche-entera.webp", false)
        );
    }
}
