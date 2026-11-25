package cl.duoc.huertohogar.config;

import cl.duoc.huertohogar.model.RolUsuario;
import cl.duoc.huertohogar.model.Usuario;
import cl.duoc.huertohogar.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UsuariosIniciales implements CommandLineRunner {

    private final UsuarioRepository repository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UsuariosIniciales(UsuarioRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        // Cuentas ficticias de EP2 para el entorno de demostración.
        crearSiFalta("Ana", "Torres", "ana.torres@example.com", "912345678", "Dirección simulada 123, Santiago", "AnaDemo2", RolUsuario.CLIENTE);
        crearSiFalta("Diego", "Morales", "diego.morales@example.com", "923456789", "", "DiegoDemo2", RolUsuario.CLIENTE);
        crearSiFalta("Camila", "Rojas", "camila.rojas@example.com", "934567890", "", "CamiDemo2", RolUsuario.CLIENTE);
        crearSiFalta("Felipe", "Soto", "felipe.soto@example.com", "945678901", "", "FeliDemo2", RolUsuario.CLIENTE);
        crearSiFalta("Valentina", "Pérez", "valentina.perez@example.com", "956789012", "", "ValeDemo2", RolUsuario.CLIENTE);
        crearSiFalta("Administrador", "Demo", "admin@huertohogar.cl", null, null, "AdminDemo2", RolUsuario.ADMINISTRADOR);
    }

    private void crearSiFalta(String nombre, String apellido, String correo, String telefono,
                             String direccion, String passwordDemo, RolUsuario rol) {
        String correoNormalizado = Usuario.normalizarCorreo(correo);
        if (!repository.existsByCorreo(correoNormalizado)) {
            String passwordHash = passwordEncoder.encode(passwordDemo);
            repository.save(new Usuario(nombre, apellido, correoNormalizado, telefono, direccion, passwordHash, rol));
        }
    }
}
