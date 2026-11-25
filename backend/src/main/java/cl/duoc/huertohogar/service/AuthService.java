package cl.duoc.huertohogar.service;

import cl.duoc.huertohogar.config.JwtConfig;
import cl.duoc.huertohogar.dto.LoginRequest;
import cl.duoc.huertohogar.dto.LoginResponse;
import cl.duoc.huertohogar.dto.UsuarioResponse;
import cl.duoc.huertohogar.model.Usuario;
import cl.duoc.huertohogar.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

@Service
public class AuthService {

    private static final long EXPIRACION_SEGUNDOS = Duration.ofHours(1).toSeconds();

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtEncoder jwtEncoder;
    private final String hashComparacion;

    public AuthService(UsuarioRepository repository, PasswordEncoder passwordEncoder, JwtEncoder jwtEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtEncoder = jwtEncoder;
        this.hashComparacion = passwordEncoder.encode(UUID.randomUUID().toString());
    }

    public LoginResponse login(LoginRequest solicitud) {
        Usuario usuario = repository.findByCorreo(Usuario.normalizarCorreo(solicitud.correo())).orElse(null);
        // Realiza una comparación BCrypt también cuando el correo no existe.
        String hash = usuario == null ? hashComparacion : usuario.getPasswordHash();
        String password = solicitud.password();
        if (password.length() > 72 || password.getBytes(StandardCharsets.UTF_8).length > 72
                || !passwordEncoder.matches(password, hash) || usuario == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Correo electrónico o contraseña incorrectos.");
        }

        Instant ahora = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(JwtConfig.EMISOR)
                .subject(usuario.getId().toString())
                .claim("rol", usuario.getRol().name())
                .issuedAt(ahora)
                .expiresAt(ahora.plusSeconds(EXPIRACION_SEGUNDOS))
                .build();
        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        String token = jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
        return new LoginResponse(token, "Bearer", EXPIRACION_SEGUNDOS, UsuarioResponse.desde(usuario));
    }
}
