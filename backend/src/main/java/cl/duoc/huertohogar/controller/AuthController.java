package cl.duoc.huertohogar.controller;

import cl.duoc.huertohogar.dto.LoginRequest;
import cl.duoc.huertohogar.dto.LoginResponse;
import cl.duoc.huertohogar.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest solicitud) {
        return service.login(solicitud);
    }
}
