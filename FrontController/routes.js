/**
 * @fileoverview Configuración de rutas del Front Controller
 * 
 * Este archivo define el mapeo entre las rutas HTTP y sus
 * controladores correspondientes. El Front Controller utiliza
 * este mapa para dirigir las solicitudes al handler apropiado.
 * 
 * @author Temas Selectos de Programación
 * @version 1.0.0
 */

const bookController = require("./controllers/bookController");
const userController = require("./controllers/userController");

/**
 * Mapa de rutas que asocia claves de método HTTP + ruta con sus handlers.
 * 
 * Formato de clave: "MÉTODO:/ruta"
 * 
 * Ejemplos:
 * - "GET:/books" -> Obtener todos los libros
 * - "POST:/books" -> Crear un nuevo libro
 * - "GET:/users" -> Obtener todos los usuarios
 * - "POST:/users" -> Crear un nuevo usuario
 * 
 * @type {Object.<string, Function>}
 */
const routes = {
  "GET:/books": bookController.getBooks,
  "POST:/books": bookController.createBook,
  "GET:/users": userController.getUsers,
  "POST:/users": userController.createUser
};

module.exports = routes;