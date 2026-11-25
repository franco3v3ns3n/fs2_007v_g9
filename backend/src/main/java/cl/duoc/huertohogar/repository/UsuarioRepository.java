package cl.duoc.huertohogar.repository;

import cl.duoc.huertohogar.model.RolUsuario;
import cl.duoc.huertohogar.model.Usuario;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByCorreo(String correoNormalizado);

    boolean existsByCorreo(String correoNormalizado);

    boolean existsByCorreoAndIdNot(String correoNormalizado, Long id);

    List<Usuario> findAllByRol(RolUsuario rol, Sort sort);

    Optional<Usuario> findByIdAndRol(Long id, RolUsuario rol);
}
