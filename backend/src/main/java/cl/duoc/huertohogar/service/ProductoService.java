package cl.duoc.huertohogar.service;

import cl.duoc.huertohogar.dto.ProductoRequest;
import cl.duoc.huertohogar.model.Producto;
import cl.duoc.huertohogar.repository.ProductoRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
public class ProductoService {

    private static final Set<String> CATEGORIAS = Set.of(
            "Frutas Frescas", "Verduras Orgánicas", "Productos Orgánicos", "Productos Lácteos");
    private static final String IMAGEN_PREDETERMINADA = "/img/portada/portada-huertohogar.webp";

    private final ProductoRepository repository;

    public ProductoService(ProductoRepository repository) {
        this.repository = repository;
    }

    public List<Producto> listar() {
        return repository.findAll(Sort.by("id"));
    }

    public Producto crear(ProductoRequest solicitud) {
        String codigo = solicitud.codigo().toUpperCase(Locale.ROOT);
        if (!codigo.matches("[A-Z0-9-]+")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Utiliza únicamente letras, números y guiones en el código.");
        }
        if (!CATEGORIAS.contains(solicitud.categoria())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selecciona una categoría válida.");
        }
        if (repository.existsByCodigo(codigo)) {
            throw codigoDuplicado();
        }

        String origen = solicitud.origen();
        if (origen == null || origen.isEmpty()) {
            origen = "No especificado";
        }
        Producto producto = new Producto(codigo, solicitud.nombre(), solicitud.categoria(), solicitud.precio(),
                solicitud.stock(), solicitud.descripcion(), solicitud.unidadPrecio(), solicitud.unidadStock(),
                origen, true, IMAGEN_PREDETERMINADA, true);

        try {
            return repository.saveAndFlush(producto);
        } catch (DataIntegrityViolationException ex) {
            // Otra solicitud puede haber guardado el código después de la consulta inicial.
            if (repository.existsByCodigo(codigo)) {
                throw codigoDuplicado();
            }
            throw ex;
        }
    }

    private static ResponseStatusException codigoDuplicado() {
        return new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un producto con este código.");
    }
}
