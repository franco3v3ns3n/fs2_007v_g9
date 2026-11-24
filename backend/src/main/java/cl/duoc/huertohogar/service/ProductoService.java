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

    public Producto buscar(Long id) {
        return repository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado."));
    }

    public Producto crear(ProductoRequest solicitud) {
        String codigo = validarSolicitud(solicitud, null);
        Producto producto = new Producto(codigo, solicitud.nombre(), solicitud.categoria(), solicitud.precio(),
                solicitud.stock(), solicitud.descripcion(), solicitud.unidadPrecio(), solicitud.unidadStock(),
                resolverOrigen(solicitud), true, IMAGEN_PREDETERMINADA, true);
        return guardar(producto);
    }

    public Producto actualizar(Long id, ProductoRequest solicitud) {
        Producto producto = buscar(id);
        String codigo = validarSolicitud(solicitud, id);
        producto.actualizar(codigo, solicitud.nombre(), solicitud.categoria(), solicitud.precio(), solicitud.stock(),
                solicitud.descripcion(), solicitud.unidadPrecio(), solicitud.unidadStock(), resolverOrigen(solicitud));
        return guardar(producto);
    }

    public void eliminar(Long id) {
        repository.delete(buscar(id));
    }

    private String validarSolicitud(ProductoRequest solicitud, Long id) {
        String codigo = solicitud.codigo().toUpperCase(Locale.ROOT);
        if (!codigo.matches("[A-Z0-9-]+")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Utiliza únicamente letras, números y guiones en el código.");
        }
        if (!CATEGORIAS.contains(solicitud.categoria())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selecciona una categoría válida.");
        }
        if (codigoOcupado(codigo, id)) {
            throw codigoDuplicado();
        }
        return codigo;
    }

    private static String resolverOrigen(ProductoRequest solicitud) {
        String origen = solicitud.origen();
        return origen == null || origen.isEmpty() ? "No especificado" : origen;
    }

    private Producto guardar(Producto producto) {
        try {
            return repository.saveAndFlush(producto);
        } catch (DataIntegrityViolationException ex) {
            // Otra solicitud puede haber guardado el código después de la consulta inicial.
            if (codigoOcupado(producto.getCodigo(), producto.getId())) {
                throw codigoDuplicado();
            }
            throw ex;
        }
    }

    private boolean codigoOcupado(String codigo, Long id) {
        return id == null ? repository.existsByCodigo(codigo) : repository.existsByCodigoAndIdNot(codigo, id);
    }

    private static ResponseStatusException codigoDuplicado() {
        return new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un producto con este código.");
    }
}
