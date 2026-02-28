/**
 * @fileoverview Servidor principal - Data Access Object Pattern
 * 
 * Este servidor Express demuestra el uso del patrón DAO (Data Access Object)
 * para abstraer y encapsular el acceso a datos.
 * 
 * El patrón DAO permite:
 * - Separar la lógica de acceso a datos de la lógica de negocio
 * - Cambiar la implementación de almacenamiento sin afectar el resto del código
 * - Facilitar el testing con diferentes implementaciones (mock, in-memory, etc.)
 * - Proporcionar una API consistente para operaciones CRUD
 * 
 * @author Temas Selectos de Programación
 * @version 1.0.0
 */

const express = require('express');
const InMemoryUserDAO = require('./dao/InMemoryUserDAO');

// Inicializa la aplicación Express
const app = express();

// Middleware para parsear JSON
app.use(express.json());

/**
 * Instancia del DAO de usuarios
 * 
 * Aquí se puede cambiar fácilmente la implementación:
 * - InMemoryUserDAO (actual)
 * - FileUserDAO (para persistencia en archivos)
 * - MySQLUserDAO (para base de datos MySQL)
 * - MongoUserDAO (para MongoDB)
 * 
 * Sin cambiar ninguna otra línea de código en las rutas.
 */
const userDAO = new InMemoryUserDAO();

/**
 * Página de inicio con documentación de la API
 * 
 * @route GET /
 */
app.get('/', (req, res) => {
  res.json({
    message: 'API de Usuarios - Patrón DAO',
    description: 'Implementación del patrón Data Access Object',
    endpoints: {
      'GET /api/users': 'Obtener todos los usuarios',
      'GET /api/users/:id': 'Obtener un usuario por ID',
      'GET /api/users/email/:email': 'Obtener un usuario por email',
      'GET /api/users/search/:name': 'Buscar usuarios por nombre',
      'POST /api/users': 'Crear un nuevo usuario',
      'PUT /api/users/:id': 'Actualizar un usuario',
      'DELETE /api/users/:id': 'Eliminar un usuario',
      'GET /api/stats': 'Obtener estadísticas'
    },
    example: {
      createUser: {
        method: 'POST',
        url: '/api/users',
        body: {
          name: 'Ana Martínez',
          email: 'ana@example.com',
          age: 30
        }
      }
    }
  });
});

/**
 * GET /api/users - Obtiene todos los usuarios
 * 
 * @route GET /api/users
 * @returns {Array<User>} Array con todos los usuarios
 * 
 * @example
 * GET /api/users
 * Response: [
 *   { id: 1, name: "Juan", email: "juan@example.com", age: 28, createdAt: "..." },
 *   { id: 2, name: "María", email: "maria@example.com", age: 32, createdAt: "..." }
 * ]
 */
app.get('/api/users', async (req, res) => {
  try {
    // Utiliza el DAO para obtener todos los usuarios
    const users = await userDAO.findAll();
    
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/users/:id - Obtiene un usuario por ID
 * 
 * @route GET /api/users/:id
 * @param {number} id - ID del usuario
 * @returns {User} Usuario encontrado
 * 
 * @example
 * GET /api/users/1
 * Response: { id: 1, name: "Juan", email: "juan@example.com", ... }
 */
app.get('/api/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // Valida que el ID sea un número válido
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'ID inválido'
      });
    }

    // Utiliza el DAO para buscar el usuario
    const user = await userDAO.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: `Usuario con ID ${id} no encontrado`
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/users/email/:email - Busca un usuario por email
 * 
 * @route GET /api/users/email/:email
 * @param {string} email - Email del usuario
 * @returns {User} Usuario encontrado
 * 
 * @example
 * GET /api/users/email/juan@example.com
 */
app.get('/api/users/email/:email', async (req, res) => {
  try {
    const email = req.params.email;
    
    // Utiliza el DAO para buscar por email
    const user = await userDAO.findByEmail(email);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: `Usuario con email ${email} no encontrado`
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/users/search/:name - Busca usuarios por nombre
 * 
 * @route GET /api/users/search/:name
 * @param {string} name - Término de búsqueda
 * @returns {Array<User>} Usuarios que coinciden
 * 
 * @example
 * GET /api/users/search/Juan
 */
app.get('/api/users/search/:name', async (req, res) => {
  try {
    const searchTerm = req.params.name;
    
    // Utiliza el método adicional del DAO
    const users = await userDAO.searchByName(searchTerm);
    
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/users - Crea un nuevo usuario
 * 
 * @route POST /api/users
 * @body {Object} userData - Datos del usuario
 * @body {string} userData.name - Nombre del usuario
 * @body {string} userData.email - Email del usuario
 * @body {number} [userData.age] - Edad del usuario
 * @returns {User} Usuario creado
 * 
 * @example
 * POST /api/users
 * Body: { "name": "Ana García", "email": "ana@example.com", "age": 30 }
 * Response: { success: true, data: { id: 4, name: "Ana García", ... } }
 */
app.post('/api/users', async (req, res) => {
  try {
    const userData = req.body;
    
    // Valida que se proporcionen los datos mínimos
    if (!userData.name || !userData.email) {
      return res.status(400).json({
        success: false,
        error: 'Se requieren name y email'
      });
    }

    // Utiliza el DAO para crear el usuario
    const newUser = await userDAO.create(userData);
    
    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: newUser
    });
  } catch (error) {
    // El DAO puede lanzar errores de validación o duplicados
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/users/:id - Actualiza un usuario existente
 * 
 * @route PUT /api/users/:id
 * @param {number} id - ID del usuario a actualizar
 * @body {Object} userData - Datos a actualizar
 * @returns {User} Usuario actualizado
 * 
 * @example
 * PUT /api/users/1
 * Body: { "name": "Juan Carlos Pérez" }
 * Response: { success: true, data: { id: 1, name: "Juan Carlos Pérez", ... } }
 */
app.put('/api/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userData = req.body;
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'ID inválido'
      });
    }

    // Utiliza el DAO para actualizar el usuario
    const updatedUser = await userDAO.update(id, userData);
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: `Usuario con ID ${id} no encontrado`
      });
    }

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: updatedUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/users/:id - Elimina un usuario
 * 
 * @route DELETE /api/users/:id
 * @param {number} id - ID del usuario a eliminar
 * @returns {Object} Confirmación de eliminación
 * 
 * @example
 * DELETE /api/users/1
 * Response: { success: true, message: "Usuario eliminado exitosamente" }
 */
app.delete('/api/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'ID inválido'
      });
    }

    // Utiliza el DAO para eliminar el usuario
    const deleted = await userDAO.delete(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: `Usuario con ID ${id} no encontrado`
      });
    }

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/stats - Obtiene estadísticas de usuarios
 * 
 * @route GET /api/stats
 * @returns {Object} Estadísticas generales
 * 
 * @example
 * GET /api/stats
 * Response: { totalUsers: 3, averageAge: 28.3 }
 */
app.get('/api/stats', async (req, res) => {
  try {
    // Utiliza el DAO para obtener los datos
    const users = await userDAO.findAll();
    const totalUsers = await userDAO.count();
    
    // Calcula estadísticas
    const usersWithAge = users.filter(u => u.age !== null);
    const averageAge = usersWithAge.length > 0
      ? usersWithAge.reduce((sum, u) => sum + u.age, 0) / usersWithAge.length
      : 0;

    res.json({
      success: true,
      data: {
        totalUsers: totalUsers,
        usersWithAge: usersWithAge.length,
        averageAge: Math.round(averageAge * 10) / 10,
        daoImplementation: userDAO.constructor.name
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Manejador de rutas no encontradas (404)
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint no encontrado',
    message: 'Visita / para ver la documentación de la API'
  });
});

/**
 * Manejador de errores global
 */
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor'
  });
});

// Inicia el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log('========================================');
  console.log('   Data Access Object Pattern - API    ');
  console.log('========================================');
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
  console.log('');
  console.log('DAO Implementation:', userDAO.constructor.name);
  console.log('');
  console.log('Available endpoints:');
  console.log('  - GET    /api/users');
  console.log('  - GET    /api/users/:id');
  console.log('  - GET    /api/users/email/:email');
  console.log('  - GET    /api/users/search/:name');
  console.log('  - POST   /api/users');
  console.log('  - PUT    /api/users/:id');
  console.log('  - DELETE /api/users/:id');
  console.log('  - GET    /api/stats');
  console.log('========================================');
});
