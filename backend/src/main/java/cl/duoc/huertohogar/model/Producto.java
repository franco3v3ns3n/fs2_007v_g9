package cl.duoc.huertohogar.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, columnDefinition = "TEXT")
    private String codigo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String nombre;

    @Column(nullable = false)
    private String categoria;

    @Column(nullable = false)
    private Integer precio;

    @Column(nullable = false)
    private Integer stock;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String unidadPrecio;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String unidadStock;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String origen;

    @Column(nullable = false)
    private Boolean origenSimulado;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String imagen;

    @Column(nullable = false)
    private Boolean imagenReferencial;

    protected Producto() {
    }

    public Producto(String codigo, String nombre, String categoria, Integer precio, Integer stock,
                    String descripcion, String unidadPrecio, String unidadStock, String origen,
                    Boolean origenSimulado, String imagen, Boolean imagenReferencial) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;
        this.stock = stock;
        this.descripcion = descripcion;
        this.unidadPrecio = unidadPrecio;
        this.unidadStock = unidadStock;
        this.origen = origen;
        this.origenSimulado = origenSimulado;
        this.imagen = imagen;
        this.imagenReferencial = imagenReferencial;
    }

    public Long getId() {
        return id;
    }

    public String getCodigo() {
        return codigo;
    }

    public String getNombre() {
        return nombre;
    }

    public String getCategoria() {
        return categoria;
    }

    public Integer getPrecio() {
        return precio;
    }

    public Integer getStock() {
        return stock;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public String getUnidadPrecio() {
        return unidadPrecio;
    }

    public String getUnidadStock() {
        return unidadStock;
    }

    public String getOrigen() {
        return origen;
    }

    public Boolean getOrigenSimulado() {
        return origenSimulado;
    }

    public String getImagen() {
        return imagen;
    }

    public Boolean getImagenReferencial() {
        return imagenReferencial;
    }
}
