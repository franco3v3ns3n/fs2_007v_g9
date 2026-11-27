package cl.duoc.huertohogar.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.util.regex.Pattern;

@Configuration(proxyBeanMethods = false)
@Profile("prod")
class DataSourceProduccion {

    private static final Pattern URL_H2_ARCHIVO =
            Pattern.compile("jdbc:h2:file:(?:[a-zA-Z]:)?[^:;\\s][^:;]*(?:;.*)?");

    @Bean
    HikariDataSource dataSource(DataSourceProperties properties) {
        String url = properties.getUrl();
        if (url == null || !URL_H2_ARCHIVO.matcher(url).matches()) {
            throw new IllegalStateException("Configura HUERTOHOGAR_DB_URL como jdbc:h2:file:<ruta persistente>.");
        }
        return properties.initializeDataSourceBuilder().type(HikariDataSource.class).build();
    }
}
