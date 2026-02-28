/**
 * @fileoverview InMemoryUserDAO - Implementación en memoria
 * 
 * Implementación concreta del patrón DAO que almacena
 * los usuarios en un array en memoria (RAM).
 * 
 * Esta implementación es útil para:
 * - Desarrollo y testing
 * - Prototipos rápidos
 * - Aplicaciones pequeñas sin persistencia
 * 
 * NOTA: Los datos se pierden al reiniciar el servidor.
 * 
 * @author Temas Selectos de Programación
 * @version 1.0.0
 */

const UserDAO = require('./UserDAO');
const User = require('../models/User');

/**
 * Clase InMemoryUserDAO
 * 
 * Implementa UserDAO almacenando datos en un array en memoria.
 * Proporciona operaciones CRUD completas sobre usuarios.
 * 
 * @extends UserDAO
 */
class InMemoryUserDAO extends UserDAO {
  /**
   * Crea una instancia de InMemoryUserDAO
   * 
   * @constructor
   */
  constructor() {
    super();
    
    /** @private {Array<User>} - Array que almacena los usuarios */
    this.users = [];
    
    /** @private {number} - Contador para generar IDs únicos */
    this.nextId = 1;

    // Inicializa con algunos usuarios de ejemplo
    this.seedData();
  }

  /**
   * Inicializa la base de datos con datos de ejemplo
   * 
   * @private
   */
  seedData() {
    // Usuarios de ejemplo para demostración
    const sampleUsers = [
      { name: 'Juan Pérez', email: 'juan@example.com', age: 28 },
      { name: 'María García', email: 'maria@example.com', age: 32 },
      { name: 'Carlos López', email: 'carlos@example.com', age: 25 }
    ];

    sampleUsers.forEach(userData => {
      this.create(userData);
    });
  }

  /**
   * Obtiene todos los usuarios
   * 
   * @override
   * @returns {Promise<Array<User>>} Array con todos los usuarios
   * 
   * @example
   * const users = await dao.findAll();
   * console.log(`Total usuarios: ${users.length}`);
   */
  async findAll() {
    // Retorna una copia del array para evitar modificaciones externas
    return [...this.users];
  }

  /**
   * Busca un usuario por su ID
   * 
   * @override
   * @param {number} id - ID del usuario
   * @returns {Promise<User|null>} Usuario encontrado o null
   * 
   * @example
   * const user = await dao.findById(1);
   * if (user) {
   *   console.log(user.name);
   * }
   */
  async findById(id) {
    const user = this.users.find(u => u.id === parseInt(id));
    return user || null;
  }

  /**
   * Busca un usuario por su email
   * 
   * @override
   * @param {string} email - Email del usuario
   * @returns {Promise<User|null>} Usuario encontrado o null
   * 
   * @example
   * const user = await dao.findByEmail('juan@example.com');
   */
  async findByEmail(email) {
    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
  }

  /**
   * Crea un nuevo usuario
   * 
   * @override
   * @param {Object} userData - Datos del nuevo usuario
   * @param {string} userData.name - Nombre del usuario
   * @param {string} userData.email - Email del usuario
   * @param {number} [userData.age] - Edad del usuario
   * @returns {Promise<User>} Usuario creado con su ID asignado
   * @throws {Error} Si el email ya existe o los datos son inválidos
   * 
   * @example
   * const newUser = await dao.create({
   *   name: 'Ana Martínez',
   *   email: 'ana@example.com',
   *   age: 30
   * });
   */
  async create(userData) {
    // Verifica si el email ya existe
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new Error(`Ya existe un usuario con el email: ${userData.email}`);
    }

    // Crea el nuevo usuario con ID autoincrementado
    const newUser = new User(
      this.nextId++,
      userData.name,
      userData.email,
      userData.age || null,
      new Date()
    );

    // Valida el usuario
    const validation = newUser.validate();
    if (!validation.valid) {
      throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
    }

    // Agrega el usuario al array
    this.users.push(newUser);

    return newUser;
  }

  /**
   * Actualiza un usuario existente
   * 
   * @override
   * @param {number} id - ID del usuario a actualizar
   * @param {Object} userData - Datos a actualizar
   * @param {string} [userData.name] - Nuevo nombre
   * @param {string} [userData.email] - Nuevo email
   * @param {number} [userData.age] - Nueva edad
   * @returns {Promise<User|null>} Usuario actualizado o null si no existe
   * @throws {Error} Si el nuevo email ya está en uso
   * 
   * @example
   * const updated = await dao.update(1, { 
   *   name: 'Juan Carlos Pérez',
   *   age: 29 
   * });
   */
  async update(id, userData) {
    const userIndex = this.users.findIndex(u => u.id === parseInt(id));
    
    if (userIndex === -1) {
      return null;
    }

    const user = this.users[userIndex];

    // Si se está actualizando el email, verifica que no exista
    if (userData.email && userData.email !== user.email) {
      const existingUser = await this.findByEmail(userData.email);
      if (existingUser) {
        throw new Error(`El email ${userData.email} ya está en uso`);
      }
    }

    // Actualiza solo los campos proporcionados
    if (userData.name !== undefined) user.name = userData.name;
    if (userData.email !== undefined) user.email = userData.email;
    if (userData.age !== undefined) user.age = userData.age;

    // Valida el usuario actualizado
    const validation = user.validate();
    if (!validation.valid) {
      throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
    }

    return user;
  }

  /**
   * Elimina un usuario
   * 
   * @override
   * @param {number} id - ID del usuario a eliminar
   * @returns {Promise<boolean>} true si se eliminó, false si no existía
   * 
   * @example
   * const deleted = await dao.delete(1);
   * if (deleted) {
   *   console.log('Usuario eliminado exitosamente');
   * }
   */
  async delete(id) {
    const initialLength = this.users.length;
    this.users = this.users.filter(u => u.id !== parseInt(id));
    
    // Retorna true si se eliminó algún usuario
    return this.users.length < initialLength;
  }

  /**
   * Cuenta el total de usuarios
   * 
   * @override
   * @returns {Promise<number>} Número total de usuarios
   * 
   * @example
   * const total = await dao.count();
   * console.log(`Total de usuarios: ${total}`);
   */
  async count() {
    return this.users.length;
  }

  /**
   * Verifica si existe un usuario con el email dado
   * 
   * @override
   * @param {string} email - Email a verificar
   * @returns {Promise<boolean>} true si existe
   * 
   * @example
   * const exists = await dao.existsByEmail('juan@example.com');
   */
  async existsByEmail(email) {
    const user = await this.findByEmail(email);
    return user !== null;
  }

  /**
   * Elimina todos los usuarios (útil para testing)
   * 
   * @returns {Promise<void>}
   * 
   * @example
   * await dao.deleteAll();
   */
  async deleteAll() {
    this.users = [];
    this.nextId = 1;
  }

  /**
   * Busca usuarios por nombre (búsqueda parcial)
   * 
   * Método adicional no definido en la interfaz base.
   * Demuestra que las implementaciones pueden agregar funcionalidad extra.
   * 
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Promise<Array<User>>} Usuarios que coinciden con la búsqueda
   * 
   * @example
   * const users = await dao.searchByName('Juan');
   */
  async searchByName(searchTerm) {
    const term = searchTerm.toLowerCase();
    return this.users.filter(u => 
      u.name.toLowerCase().includes(term)
    );
  }
}

// Exporta la implementación InMemoryUserDAO
module.exports = InMemoryUserDAO;
