package cl.duoc.huertohogar.config;

import cl.duoc.huertohogar.model.RolUsuario;
import cl.duoc.huertohogar.model.Usuario;
import cl.duoc.huertohogar.repository.UsuarioRepository;
import jakarta.validation.Validator;
import jakarta.validation.constraints.Email;
import org.springframework.beans.factory.SmartInitializingSingleton;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;

@Component
@Profile("prod")
class AdministradorInicial implements SmartInitializingSingleton {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final Environment environment;
    private final Validator validator;

    AdministradorInicial(UsuarioRepository repository, PasswordEncoder passwordEncoder,
                         Environment environment, Validator validator) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.environment = environment;
        this.validator = validator;
    }

    @Override
    public void afterSingletonsInstantiated() {
        String correo = Usuario.normalizarCorreo(environment.getProperty("HUERTOHOGAR_ADMIN_CORREO", ""));
        if (correo.isBlank() || correo.length() > 255
                || !validator.validateValue(Credencial.class, "correo", correo).isEmpty()) {
            throw new IllegalStateException("Configura un correo válido en HUERTOHOGAR_ADMIN_CORREO.");
        }

        Usuario existente = repository.findByCorreo(correo).orElse(null);
        if (existente != null) {
            if (existente.getRol() != RolUsuario.ADMINISTRADOR) {
                throw new IllegalStateException("HUERTOHOGAR_ADMIN_CORREO coincide con una cuenta sin rol ADMINISTRADOR.");
            }
            return;
        }

        String password = System.getenv("HUERTOHOGAR_ADMIN_PASSWORD");
        if (password == null || password.isBlank() || password.codePointCount(0, password.length()) < 12
                || password.getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new IllegalStateException("Configura HUERTOHOGAR_ADMIN_PASSWORD con al menos 12 caracteres y hasta 72 bytes UTF-8.");
        }

        repository.save(new Usuario("Administrador", "HuertoHogar", correo, null, null,
                passwordEncoder.encode(password), RolUsuario.ADMINISTRADOR));
    }

    private record Credencial(@Email String correo) {
    }
}
