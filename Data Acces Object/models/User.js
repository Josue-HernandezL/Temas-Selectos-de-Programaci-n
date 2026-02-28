/**
 * @fileoverview Modelo de datos User
 * 
 * Este archivo define la clase User que representa la entidad
 * de usuario en la aplicación. Es el modelo de datos utilizado
 * por el patrón DAO.
 * 
 * @author Temas Selectos de Programación
 * @version 1.0.0
 */

/**
 * Clase User - Modelo de datos de usuario
 * 
 * Representa un usuario en el sistema con sus propiedades
 * y métodos de utilidad.
 */
class User {
  /**
   * Crea una instancia de User
   * 
   * @constructor
   * @param {number} id - Identificador único del usuario
   * @param {string} name - Nombre completo del usuario
   * @param {string} email - Correo electrónico del usuario
   * @param {number} [age] - Edad del usuario (opcional)
   * @param {Date} [createdAt] - Fecha de creación (por defecto fecha actual)
   * 
   * @example
   * const user = new User(1, 'Juan Pérez', 'juan@example.com', 25);
   */
  constructor(id, name, email, age = null, createdAt = new Date()) {
    /** @type {number} - ID único del usuario */
    this.id = id;
    
    /** @type {string} - Nombre completo del usuario */
    this.name = name;
    
    /** @type {string} - Email del usuario */
    this.email = email;
    
    /** @type {number|null} - Edad del usuario */
    this.age = age;
    
    /** @type {Date} - Fecha de creación del registro */
    this.createdAt = createdAt;
  }

  /**
   * Valida si el usuario tiene datos válidos
   * 
   * @returns {Object} Objeto con resultado de validación
   * @returns {boolean} .valid - true si los datos son válidos
   * @returns {Array<string>} .errors - Lista de errores encontrados
   * 
   * @example
   * const result = user.validate();
   * if (!result.valid) {
   *   console.log('Errores:', result.errors);
   * }
   */
  validate() {
    const errors = [];

    if (!this.name || this.name.trim() === '') {
      errors.push('El nombre es requerido');
    }

    if (!this.email || this.email.trim() === '') {
      errors.push('El email es requerido');
    } else if (!this.isValidEmail(this.email)) {
      errors.push('El email no tiene un formato válido');
    }

    if (this.age !== null && (this.age < 0 || this.age > 150)) {
      errors.push('La edad debe estar entre 0 y 150');
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Valida si un email tiene formato válido
   * 
   * @private
   * @param {string} email - Email a validar
   * @returns {boolean} true si el email es válido
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Convierte el usuario a un objeto plano
   * 
   * Útil para serialización JSON o para enviar al cliente.
   * 
   * @returns {Object} Objeto plano con los datos del usuario
   * 
   * @example
   * const userObj = user.toJSON();
   * res.json(userObj);
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      age: this.age,
      createdAt: this.createdAt
    };
  }

  /**
   * Crea una instancia de User desde un objeto plano
   * 
   * @static
   * @param {Object} obj - Objeto con datos del usuario
   * @param {number} obj.id - ID del usuario
   * @param {string} obj.name - Nombre del usuario
   * @param {string} obj.email - Email del usuario
   * @param {number} [obj.age] - Edad del usuario
   * @param {Date|string} [obj.createdAt] - Fecha de creación
   * 
   * @returns {User} Nueva instancia de User
   * 
   * @example
   * const user = User.fromObject({
   *   id: 1,
   *   name: 'Ana García',
   *   email: 'ana@example.com'
   * });
   */
  static fromObject(obj) {
    return new User(
      obj.id,
      obj.name,
      obj.email,
      obj.age || null,
      obj.createdAt ? new Date(obj.createdAt) : new Date()
    );
  }

  /**
   * Obtiene una representación en string del usuario
   * 
   * @returns {string} Representación del usuario
   * 
   * @example
   * console.log(user.toString());
   * // Output: "User #1: Juan Pérez (juan@example.com)"
   */
  toString() {
    return `User #${this.id}: ${this.name} (${this.email})`;
  }
}

// Exporta la clase User
module.exports = User;
