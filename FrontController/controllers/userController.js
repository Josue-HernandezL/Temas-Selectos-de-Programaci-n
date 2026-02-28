/**
 * @fileoverview Controlador de operaciones relacionadas con usuarios
 * 
 * Este controlador maneja todas las operaciones CRUD relacionadas
 * con el recurso de usuarios. En una aplicación real, estas funciones
 * interactuarían con una base de datos y aplicarían validaciones.
 * 
 * @author Temas Selectos de Programación
 * @version 1.0.0
 */

/**
 * Obtiene la lista de todos los usuarios registrados
 * 
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.method - Método HTTP de la solicitud
 * @param {Object} req.path - Ruta de la solicitud
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} res.json - Función para enviar respuesta JSON
 * 
 * @returns {void} Envía una respuesta JSON con la lista de usuarios
 * 
 * @example
 * // GET /users
 * // Response: [{ id: 1, name: "Josue" }, ...]
 */
function getUsers(req, res) {
  // En una aplicación real, esto haría una consulta a la base de datos
  const users = [
    { id: 1, name: "Josue" },
    { id: 2, name: "Maria" }
  ];
  
  res.json(users);
}

/**
 * Crea un nuevo usuario con los datos proporcionados
 * 
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.body - Cuerpo de la solicitud con los datos del usuario
 * @param {string} req.body.name - Nombre del usuario
 * @param {string} [req.body.email] - Email del usuario (opcional)
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} res.status - Función para establecer el código de estado
 * @param {Function} res.json - Función para enviar respuesta JSON
 * 
 * @returns {void} Envía una respuesta JSON con código 201 (Created)
 * 
 * @example
 * // POST /users
 * // Body: { "name": "Carlos", "email": "carlos@example.com" }
 * // Response: { "message": "User created", "data": {...} }
 */
function createUser(req, res) {
  // En una aplicación real, esto:
  // 1. Validaría los datos de entrada
  // 2. Verificaría que el usuario no exista
  // 3. Insertaría el usuario en la base de datos
  // 4. Retornaría el usuario creado con su ID generado
  
  res.status(201).json({
    message: "User created",
    data: req.body
  });
}

// Exporta las funciones del controlador
module.exports = {
  getUsers,
  createUser
};