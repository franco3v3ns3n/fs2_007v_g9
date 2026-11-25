package cl.duoc.huertohogar.dto;

import cl.duoc.huertohogar.model.RolUsuario;
import cl.duoc.huertohogar.model.Usuario;

public record UsuarioResponse(Long id, String nombre, String apellido, String correo,
                              String telefono, String direccion, RolUsuario rol) {
    public static UsuarioResponse desde(Usuario usuario) {
        return new UsuarioResponse(usuario.getId(), usuario.getNombre(), usuario.getApellido(),
                usuario.getCorreo(), usuario.getTelefono(), usuario.getDireccion(), usuario.getRol());
    }
}
