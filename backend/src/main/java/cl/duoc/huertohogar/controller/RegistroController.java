package cl.duoc.huertohogar.controller;

import cl.duoc.huertohogar.dto.UsuarioRegistroRequest;
import cl.duoc.huertohogar.dto.UsuarioResponse;
import cl.duoc.huertohogar.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuarios")
public class RegistroController {

    private final UsuarioService service;

    public RegistroController(UsuarioService service) {
        this.service = service;
    }

    @PostMapping("/registro")
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponse registrar(@Valid @RequestBody UsuarioRegistroRequest solicitud) {
        return service.registrar(solicitud);
    }
}
