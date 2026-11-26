package cl.duoc.huertohogar.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class InicializacionCatalogo {

    @Id
    private String nombre;

    protected InicializacionCatalogo() {
    }

    public InicializacionCatalogo(String nombre) {
        this.nombre = nombre;
    }
}
