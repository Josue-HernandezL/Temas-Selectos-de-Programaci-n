/**
 * @fileoverview UserDAO - Data Access Object Interface
 * 
 * Define la interfaz (contrato) que todas las implementaciones
 * de acceso a datos de usuarios deben seguir.
 * 
 * Este patrón permite cambiar la fuente de datos (memoria, archivo,
 * base de datos) sin afectar el resto de la aplicación.
 * 
 * @author Temas Selectos de Programación
 * @version 1.0.0
 */

/**
 * Clase abstracta UserDAO
 * 
 * Define los métodos CRUD estándar que toda implementación
 * de DAO de usuarios debe proporcionar.
 * 
 * Esta clase no debe ser instanciada directamente, sino que
 * debe ser extendida por clases concretas como InMemoryUserDAO,
 * FileUserDAO, MySQLUserDAO, etc.
 */
class UserDAO {
  /**
   * Crea una instancia de UserDAO
   * 
   * @constructor
   * @throws {Error} Si se intenta instanciar directamente
   */
  constructor() {
    // Previene la instanciación directa de la clase abstracta
    if (this.constructor === UserDAO) {
      throw new Error('UserDAO es una clase abstracta y no puede ser instanciada directamente');
    }
  }

  /**
   * Obtiene todos los usuarios
   * 
   * @abstract
   * @returns {Promise<Array<User>>} Promesa que resuelve a un array de usuarios
   * @throws {Error} Si el método no está implementado
   * 
   * @example
   * const users = await userDAO.findAll();
   */
  async findAll() {
    throw new Error('El método findAll() debe ser implementado');
  }

  /**
   * Busca un usuario por su ID
   * 
   * @abstract
   * @param {number} id - ID del usuario a buscar
   * @returns {Promise<User|null>} Promesa que resuelve al usuario o null si no existe
   * @throws {Error} Si el método no está implementado
   * 
   * @example
   * const user = await userDAO.findById(1);
   */
  async findById(id) {
    throw new Error('El método findById() debe ser implementado');
  }

  /**
   * Busca un usuario por su email
   * 
   * @abstract
   * @param {string} email - Email del usuario a buscar
   * @returns {Promise<User|null>} Promesa que resuelve al usuario o null si no existe
   * @throws {Error} Si el método no está implementado
   * 
   * @example
   * const user = await userDAO.findByEmail('juan@example.com');
   */
  async findByEmail(email) {
    throw new Error('El método findByEmail() debe ser implementado');
  }

  /**
   * Crea un nuevo usuario
   * 
   * @abstract
   * @param {Object} userData - Datos del usuario a crear
   * @param {string} userData.name - Nombre del usuario
   * @param {string} userData.email - Email del usuario
   * @param {number} [userData.age] - Edad del usuario
   * @returns {Promise<User>} Promesa que resuelve al usuario creado
   * @throws {Error} Si el método no está implementado
   * 
   * @example
   * const newUser = await userDAO.create({
   *   name: 'Ana García',
   *   email: 'ana@example.com',
   *   age: 28
   * });
   */
  async create(userData) {
    throw new Error('El método create() debe ser implementado');
  }

  /**
   * Actualiza un usuario existente
   * 
   * @abstract
   * @param {number} id - ID del usuario a actualizar
   * @param {Object} userData - Datos a actualizar
   * @returns {Promise<User|null>} Promesa que resuelve al usuario actualizado o null
   * @throws {Error} Si el método no está implementado
   * 
   * @example
   * const updated = await userDAO.update(1, { name: 'Juan López' });
   */
  async update(id, userData) {
    throw new Error('El método update() debe ser implementado');
  }

  /**
   * Elimina un usuario
   * 
   * @abstract
   * @param {number} id - ID del usuario a eliminar
   * @returns {Promise<boolean>} Promesa que resuelve a true si se eliminó
   * @throws {Error} Si el método no está implementado
   * 
   * @example
   * const deleted = await userDAO.delete(1);
   */
  async delete(id) {
    throw new Error('El método delete() debe ser implementado');
  }

  /**
   * Cuenta el total de usuarios
   * 
   * @abstract
   * @returns {Promise<number>} Promesa que resuelve al número total de usuarios
   * @throws {Error} Si el método no está implementado
   * 
   * @example
   * const count = await userDAO.count();
   */
  async count() {
    throw new Error('El método count() debe ser implementado');
  }

  /**
   * Verifica si existe un usuario con el email dado
   * 
   * @abstract
   * @param {string} email - Email a verificar
   * @returns {Promise<boolean>} Promesa que resuelve a true si existe
   * @throws {Error} Si el método no está implementado
   * 
   * @example
   * const exists = await userDAO.existsByEmail('juan@example.com');
   */
  async existsByEmail(email) {
    throw new Error('El método existsByEmail() debe ser implementado');
  }
}

// Exporta la clase base UserDAO
module.exports = UserDAO;
