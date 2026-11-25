package cl.duoc.huertohogar.controller;

import com.fasterxml.jackson.databind.JsonMappingException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.HandlerMapping;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestControllerAdvice
public class ApiErrors {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> datosInvalidos(MethodArgumentNotValidException ex) {
        String mensaje = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getDefaultMessage()).findFirst().orElse("Datos inválidos.");
        return ResponseEntity.badRequest().body(Map.of("message", mensaje));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> jsonInvalido(HttpMessageNotReadableException ex,
                                                           HttpServletRequest request) {
        if (!esSolicitudDeProducto(request)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Envía un objeto JSON válido con los campos permitidos."));
        }
        String mensaje = "Envía un objeto JSON válido con los tipos de datos del producto.";
        if (ex.getCause() instanceof JsonMappingException error && !error.getPath().isEmpty()) {
            String campo = error.getPath().getFirst().getFieldName();
            if ("precio".equals(campo) || "stock".equals(campo)) {
                mensaje = "El campo " + campo + " debe ser un número entero dentro del rango permitido.";
            }
        }
        return ResponseEntity.badRequest().body(Map.of("message", mensaje));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> estadoInvalido(ResponseStatusException ex) {
        String mensaje = ex.getReason() == null ? "Error en la solicitud." : ex.getReason();
        return ResponseEntity.status(ex.getStatusCode()).body(Map.of("message", mensaje));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, String>> idInvalido(HttpServletRequest request) {
        String mensaje = esSolicitudDeProducto(request)
                ? "El ID del producto debe ser un número entero válido."
                : "El ID debe ser un número entero válido.";
        return ResponseEntity.badRequest().body(Map.of("message", mensaje));
    }

    private static boolean esSolicitudDeProducto(HttpServletRequest request) {
        return request.getAttribute(HandlerMapping.BEST_MATCHING_HANDLER_ATTRIBUTE) instanceof HandlerMethod handler
                && handler.getBeanType() == ProductoController.class;
    }
}
