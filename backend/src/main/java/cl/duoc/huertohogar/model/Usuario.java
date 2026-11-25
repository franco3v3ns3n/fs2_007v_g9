package cl.duoc.huertohogar.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;

import java.util.Locale;
import java.util.Objects;
import java.util.regex.Pattern;

@Entity
public class Usuario {

    private static final Pattern HASH_BCRYPT =
            Pattern.compile("\\$2[aby]\\$(0[4-9]|[12][0-9]|3[01])\\$[./A-Za-z0-9]{53}");

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String nombre;

    @NotBlank
    @Column(nullable = false)
    private String apellido;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String correo;

    private String telefono;

    private String direccion;

    @Column(nullable = false, length = 60)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RolUsuario rol;

    protected Usuario() {
    }

    public Usuario(String nombre, String apellido, String correo, String telefono, String direccion,
                   String passwordHash, RolUsuario rol) {
        if (passwordHash == null || !HASH_BCRYPT.matcher(passwordHash).matches()) {
            throw new IllegalArgumentException("Se requiere un hash BCrypt válido.");
        }
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = normalizarCorreo(correo);
        this.telefono = telefono;
        this.direccion = direccion;
        this.passwordHash = passwordHash;
        this.rol = Objects.requireNonNull(rol);
    }

    public static String normalizarCorreo(String correo) {
        return correo.strip().toLowerCase(Locale.ROOT);
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public String getCorreo() {
        return correo;
    }

    public String getTelefono() {
        return telefono;
    }

    public String getDireccion() {
        return direccion;
    }

    @JsonIgnore
    public String getPasswordHash() {
        return passwordHash;
    }

    public RolUsuario getRol() {
        return rol;
    }
}
