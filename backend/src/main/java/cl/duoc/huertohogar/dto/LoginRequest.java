package cl.duoc.huertohogar.dto;

import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "Ingresa el correo electrónico.") String correo,
        @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
        @NotBlank(message = "Ingresa la contraseña.") String password
) {
    @JsonAnySetter
    void rechazarCampoDesconocido(String campo, JsonNode valor) {
        throw new IllegalArgumentException("La solicitud contiene un campo no permitido.");
    }

    @Override
    public String toString() {
        return "LoginRequest";
    }
}
