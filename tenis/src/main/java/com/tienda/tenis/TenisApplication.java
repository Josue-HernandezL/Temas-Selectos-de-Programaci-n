package com.tienda.tenis;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Punto de entrada de la aplicacion Spring Boot para la tienda de tenis.
 *
 * <p>Esta clase inicializa el contexto de Spring y registra los componentes
 * anotados (controladores, servicios, configuraciones, etc.) para que la
 * aplicacion pueda atender solicitudes web.</p>
 */
@SpringBootApplication
public class TenisApplication {

	/**
	 * Inicia la aplicacion web.
	 *
	 * @param args argumentos de linea de comandos opcionales.
	 */
	public static void main(String[] args) {
		SpringApplication.run(TenisApplication.class, args);
	}

}
