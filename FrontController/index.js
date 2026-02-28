/**
 * @fileoverview Implementación del patrón Front Controller
 * 
 * Este archivo implementa el patrón de diseño Front Controller,
 * que proporciona un punto de entrada centralizado para todas las
 * solicitudes HTTP de la aplicación.
 * 
 * @author Temas Selectos de Programación
 * @version 1.0.0
 */

const express = require("express");
const routes = require("./routes");

// Inicializa la aplicación Express
const app = express();

// Middleware para parsear JSON en el body de las peticiones
app.use(express.json());

/**
 * FRONT CONTROLLER - Middleware principal
 * 
 * Este middleware intercepta todas las solicitudes HTTP y las dirige
 * al controlador apropiado basándose en el método HTTP y la ruta.
 * 
 * Flujo de trabajo:
 * 1. Construye una clave única combinando método HTTP y ruta
 * 2. Busca el handler correspondiente en el mapa de rutas
 * 3. Si existe, ejecuta el handler
 * 4. Si no existe, devuelve un error 404
 * 5. Captura cualquier error de ejecución y devuelve un error 500
 */
app.use((req, res) => {

  // Construye la clave de ruta en formato "MÉTODO:/ruta"
  const key = req.method + ":" + req.path;

  // Log para debugging
  console.log("Request received:", key);

  // Busca el handler correspondiente en el mapa de rutas
  const handler = routes[key];

  // Si no existe un handler para esta ruta, retorna 404
  if (!handler) {
    return res.status(404).json({
      error: "Route not found"
    });
  }

  // Intenta ejecutar el handler y captura cualquier error
  try {
    handler(req, res);
  } catch (error) {
    // Si ocurre un error durante la ejecución, retorna 500
    res.status(500).json({
      error: "Internal server error"
    });
  }

});

// Inicia el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});