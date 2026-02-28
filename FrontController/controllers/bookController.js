/**
 * @fileoverview Controlador de operaciones relacionadas con libros
 * 
 * Este controlador maneja todas las operaciones CRUD relacionadas
 * con el recurso de libros. En una aplicación real, estas funciones
 * interactuarían con una base de datos.
 * 
 * @author Temas Selectos de Programación
 * @version 1.0.0
 */

/**
 * Obtiene la lista de todos los libros disponibles
 * 
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.method - Método HTTP de la solicitud
 * @param {Object} req.path - Ruta de la solicitud
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} res.json - Función para enviar respuesta JSON
 * 
 * @returns {void} Envía una respuesta JSON con la lista de libros
 * 
 * @example
 * // GET /books
 * // Response: [{ id: 1, title: "Clean Code" }, ...]
 */
function getBooks(req, res) {
  // En una aplicación real, esto haría una consulta a la base de datos
  const books = [
    { id: 1, title: "Clean Code" },
    { id: 2, title: "Design Patterns" }
  ];
  
  res.json(books);
}

/**
 * Crea un nuevo libro con los datos proporcionados
 * 
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.body - Cuerpo de la solicitud con los datos del libro
 * @param {string} req.body.title - Título del libro
 * @param {string} [req.body.author] - Autor del libro (opcional)
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} res.status - Función para establecer el código de estado
 * @param {Function} res.json - Función para enviar respuesta JSON
 * 
 * @returns {void} Envía una respuesta JSON con código 201 (Created)
 * 
 * @example
 * // POST /books
 * // Body: { "title": "New Book", "author": "John Doe" }
 * // Response: { "message": "Book created", "data": {...} }
 */
function createBook(req, res) {
  // En una aplicación real, esto insertaría el libro en la base de datos
  // y retornaría el libro creado con su ID generado
  
  res.status(201).json({
    message: "Book created",
    data: req.body
  });
}

// Exporta las funciones del controlador
module.exports = {
  getBooks,
  createBook
};