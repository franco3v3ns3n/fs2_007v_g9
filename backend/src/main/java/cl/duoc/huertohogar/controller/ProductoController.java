package cl.duoc.huertohogar.controller;

import cl.duoc.huertohogar.dto.ProductoRequest;
import cl.duoc.huertohogar.model.Producto;
import cl.duoc.huertohogar.service.ProductoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService service;

    public ProductoController(ProductoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Producto> listar() {
        return service.listar();
    }

    @PostMapping
    public ResponseEntity<Producto> crear(@Valid @RequestBody ProductoRequest solicitud) {
        Producto producto = service.crear(solicitud);
        return ResponseEntity.created(URI.create("/api/productos/" + producto.getId())).body(producto);
    }
}
