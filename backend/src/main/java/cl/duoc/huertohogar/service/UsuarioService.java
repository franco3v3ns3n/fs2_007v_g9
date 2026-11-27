package cl.duoc.huertohogar.service;

import cl.duoc.huertohogar.dto.UsuarioActualizarRequest;
import cl.duoc.huertohogar.dto.UsuarioCrearRequest;
import cl.duoc.huertohogar.dto.UsuarioRegistroRequest;
import cl.duoc.huertohogar.dto.UsuarioResponse;
import cl.duoc.huertohogar.model.RolUsuario;
import cl.duoc.huertohogar.model.Usuario;
import cl.duoc.huertohogar.repository.UsuarioRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.sql.SQLException;
import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public UsuarioResponse registrar(UsuarioRegistroRequest solicitud) {
        if (!solicitud.password().equals(solicitud.confirmar())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Las contraseñas no coinciden.");
        }
        return crearCliente(solicitud.nombre(), solicitud.apellido(), solicitud.correo(), solicitud.telefono(),
                "", solicitud.password());
    }

    public UsuarioResponse crear(UsuarioCrearRequest solicitud) {
        return crearCliente(solicitud.nombre(), solicitud.apellido(), solicitud.correo(), solicitud.telefono(),
                solicitud.direccion(), solicitud.password());
    }

    public List<UsuarioResponse> listar() {
        return repository.findAllByRol(RolUsuario.CLIENTE, Sort.by("id")).stream()
                .map(UsuarioResponse::desde).toList();
    }

    public UsuarioResponse buscar(Long id) {
        return UsuarioResponse.desde(buscarCliente(id));
    }

    @Transactional
    public UsuarioResponse actualizar(Long id, UsuarioActualizarRequest solicitud) {
        Usuario usuario = buscarCliente(id);
        String correo = Usuario.normalizarCorreo(solicitud.correo());
        if (repository.existsByCorreoAndIdNot(correo, id)) {
            throw correoDuplicado();
        }
        usuario.actualizarDatos(solicitud.nombre(), solicitud.apellido(), correo, solicitud.telefono(),
                solicitud.direccion());
        return guardar(usuario);
    }

    @Transactional
    public void eliminar(Long id) {
        repository.delete(buscarCliente(id));
    }

    private UsuarioResponse crearCliente(String nombre, String apellido, String correo, String telefono,
                                         String direccion, String password) {
        String correoNormalizado = Usuario.normalizarCorreo(correo);
        if (repository.existsByCorreo(correoNormalizado)) {
            throw correoDuplicado();
        }
        return guardar(new Usuario(nombre, apellido, correoNormalizado, telefono, direccion,
                passwordEncoder.encode(password), RolUsuario.CLIENTE));
    }

    private Usuario buscarCliente(Long id) {
        return repository.findByIdAndRol(id, RolUsuario.CLIENTE).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado."));
    }

    private UsuarioResponse guardar(Usuario usuario) {
        try {
            return UsuarioResponse.desde(repository.saveAndFlush(usuario));
        } catch (DataIntegrityViolationException ex) {
            // El correo es la única clave única que el formulario puede modificar.
            if (ex.getMostSpecificCause() instanceof SQLException error && "23505".equals(error.getSQLState())) {
                throw correoDuplicado();
            }
            throw ex;
        }
    }

    private static ResponseStatusException correoDuplicado() {
        return new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un usuario con este correo electrónico.");
    }
}
