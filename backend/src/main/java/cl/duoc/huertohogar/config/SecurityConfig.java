package cl.duoc.huertohogar.config;

import cl.duoc.huertohogar.model.RolUsuario;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.DispatcherType;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;

import java.io.IOException;
import java.util.Map;

@Configuration(proxyBeanMethods = false)
public class SecurityConfig {

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http, ObjectMapper mapper) throws Exception {
        String administrador = RolUsuario.ADMINISTRADOR.name();
        AuthenticationEntryPoint sinAutenticacion = (request, response, ex) -> {
            response.setHeader(HttpHeaders.WWW_AUTHENTICATE, "Bearer");
            escribirError(response, mapper, HttpStatus.UNAUTHORIZED, "Se requiere un token válido.");
        };
        AccessDeniedHandler sinPermisos = (request, response, ex) ->
                escribirError(response, mapper, HttpStatus.FORBIDDEN, "No tienes permiso para esta operación.");

        return http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .dispatcherTypeMatchers(DispatcherType.ERROR).permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/productos", "/api/productos/{id}").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/login", "/api/usuarios/registro").permitAll()
                        .requestMatchers(HttpMethod.GET, "/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/usuarios", "/api/usuarios/{id}").hasRole(administrador)
                        .requestMatchers(HttpMethod.POST, "/api/productos", "/api/usuarios").hasRole(administrador)
                        .requestMatchers(HttpMethod.PUT, "/api/productos/{id}", "/api/usuarios/{id}").hasRole(administrador)
                        .requestMatchers(HttpMethod.DELETE, "/api/productos/{id}", "/api/usuarios/{id}").hasRole(administrador)
                        .anyRequest().denyAll())
                .exceptionHandling(errors -> errors.authenticationEntryPoint(sinAutenticacion)
                        .accessDeniedHandler(sinPermisos))
                .oauth2ResourceServer(oauth -> oauth.authenticationEntryPoint(sinAutenticacion)
                        .accessDeniedHandler(sinPermisos)
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())))
                .build();
    }

    private static JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter autoridades = new JwtGrantedAuthoritiesConverter();
        autoridades.setAuthoritiesClaimName("rol");
        autoridades.setAuthorityPrefix("ROLE_");
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(autoridades);
        return converter;
    }

    private static void escribirError(HttpServletResponse response, ObjectMapper mapper, HttpStatus estado,
                                      String mensaje) throws IOException {
        response.setStatus(estado.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        mapper.writeValue(response.getOutputStream(), Map.of("message", mensaje));
    }
}
