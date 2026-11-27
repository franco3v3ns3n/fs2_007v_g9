package cl.duoc.huertohogar.dto;

import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@JsonIgnoreProperties("direccion")
public record UsuarioRegistroRequest(
        @NotBlank(message = "Ingresa el nombre.") @Size(max = 255) String nombre,
        @NotBlank(message = "Ingresa el apellido.") @Size(max = 255) String apellido,
        @NotBlank(message = "Ingresa el correo electrónico.")
        @Email(message = "Ingresa un correo electrónico válido.") @Size(max = 255) String correo,
        @NotBlank(message = "Ingresa el teléfono.")
        @Pattern(regexp = "[0-9]{9}", message = "Ingresa un teléfono válido de 9 dígitos.") String telefono,
        @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
        @NotBlank(message = "Ingresa la contraseña.")
        @Size(min = 4, max = 10, message = "La contraseña debe tener entre 4 y 10 caracteres.") String password,
        @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
        @NotBlank(message = "Confirma tu contraseña.") String confirmar
) {
    public UsuarioRegistroRequest {
        nombre = nombre == null ? null : nombre.strip();
        apellido = apellido == null ? null : apellido.strip();
        correo = correo == null ? null : correo.strip();
        telefono = telefono == null ? null : telefono.strip();
    }

    @JsonAnySetter
    void rechazarCampoDesconocido(String campo, JsonNode valor) {
        throw new IllegalArgumentException("La solicitud contiene un campo no permitido.");
    }

    @Override
    public String toString() {
        return "UsuarioRegistroRequest";
    }
}
