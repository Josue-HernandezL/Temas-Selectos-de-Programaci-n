package com.tienda.tenis;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controlador MVC para las vistas publicas de la tienda.
 *
 * <p>Actualmente expone una pagina de inicio y una vista de catalogo.
 * Se usa Thymeleaf para renderizar HTML del lado del servidor.</p>
 */
@Controller 
public class SneakerController {

    /**
     * Muestra la pagina principal.
     *
     * <p>Agrega un titulo al modelo para que sea renderizado en la plantilla
     * {@code index.html}.</p>
     *
     * @param model contenedor de atributos para la vista.
     * @return nombre logico de la plantilla a renderizar.
     */
    @GetMapping("/")
    public String mostrarInicio(Model model) {
        model.addAttribute("titulo", "Bienvenido a la Tienda de Tenis");
        return "index"; 
    }

    /**
     * Muestra la vista de catalogo con productos de ejemplo.
     *
     * @return nombre logico de la plantilla del catalogo.
     */
    @GetMapping("/catalogo")
    public String mostrarCatalogo() {
        return "catalogo";
    }
}