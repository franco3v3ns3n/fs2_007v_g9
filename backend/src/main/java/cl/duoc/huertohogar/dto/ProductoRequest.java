package cl.duoc.huertohogar.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.regex.Pattern;

public record ProductoRequest(
        @NotBlank(message = "Ingresa el código del producto.") String codigo,
        @NotBlank(message = "Ingresa el nombre del producto.") String nombre,
        @NotBlank(message = "Selecciona una categoría válida.") String categoria,
        @NotNull(message = "Ingresa el precio del producto.")
        @Min(value = 1, message = "Ingresa un precio entero mayor que 0.") Integer precio,
        @NotNull(message = "Ingresa el stock del producto.")
        @Min(value = 0, message = "Ingresa un stock entero igual o mayor que 0.") Integer stock,
        @NotBlank(message = "Ingresa la descripción del producto.") String descripcion,
        @NotBlank(message = "Ingresa la unidad de precio.") String unidadPrecio,
        @NotBlank(message = "Ingresa la unidad de stock.") String unidadStock,
        String origen
) {
    // Equivale a los espacios que elimina trim() en el formulario React.
    private static final String ESPACIO = "[\\s\\p{Z}\\uFEFF]";
    private static final Pattern ESPACIOS_EN_EXTREMOS =
            Pattern.compile("\\A" + ESPACIO + "++|(?<!" + ESPACIO + ")" + ESPACIO + "++\\z");

    public ProductoRequest {
        codigo = recortar(codigo);
        nombre = recortar(nombre);
        descripcion = recortar(descripcion);
        unidadPrecio = recortar(unidadPrecio);
        unidadStock = recortar(unidadStock);
        origen = recortar(origen);
    }

    private static String recortar(String valor) {
        return valor == null ? null : ESPACIOS_EN_EXTREMOS.matcher(valor).replaceAll("");
    }
}
