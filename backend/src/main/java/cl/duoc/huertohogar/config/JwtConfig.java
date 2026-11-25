package cl.duoc.huertohogar.config;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtClaimNames;
import org.springframework.security.oauth2.jwt.JwtClaimValidator;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtIssuerValidator;
import org.springframework.security.oauth2.jwt.JwtTimestampValidator;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.Objects;

@Configuration(proxyBeanMethods = false)
public class JwtConfig {

    public static final String EMISOR = "huertohogar-api";

    @Bean
    SecretKey jwtKey(Environment environment) {
        String secreto = environment.getProperty("HUERTOHOGAR_JWT_SECRET", "");
        byte[] bytes;
        try {
            bytes = Base64.getDecoder().decode(secreto);
        } catch (IllegalArgumentException ex) {
            throw secretoInvalido();
        }
        if (bytes.length < 32) {
            throw secretoInvalido();
        }
        return new SecretKeySpec(bytes, "HmacSHA256");
    }

    @Bean
    JwtEncoder jwtEncoder(SecretKey jwtKey) {
        return new NimbusJwtEncoder(new ImmutableSecret<>(jwtKey));
    }

    @Bean
    JwtDecoder jwtDecoder(SecretKey jwtKey) {
        NimbusJwtDecoder decoder = NimbusJwtDecoder.withSecretKey(jwtKey).macAlgorithm(MacAlgorithm.HS256).build();
        decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(
                new JwtIssuerValidator(EMISOR),
                new JwtClaimValidator<Instant>(JwtClaimNames.EXP, Objects::nonNull),
                new JwtTimestampValidator(Duration.ZERO)));
        return decoder;
    }

    private static IllegalStateException secretoInvalido() {
        return new IllegalStateException("Configura HUERTOHOGAR_JWT_SECRET en Base64 con al menos 32 bytes aleatorios.");
    }
}
