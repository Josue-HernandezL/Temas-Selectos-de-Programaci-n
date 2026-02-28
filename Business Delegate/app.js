/**
 * Business Delegate Pattern Implementation
 * 
 * Este archivo implementa el patrón Business Delegate, que actúa como intermediario
 * entre la capa de presentación (controladores HTTP) y la capa de servicios de negocio.
 * 
 * Componentes principales:
 * - Business Services: Servicios que contienen la lógica de negocio
 * - Business Lookup: Servicio de localización que mantiene registro de servicios
 * - Business Delegate: Intermediario entre controladores y servicios
 * 
 * @author Proyecto educativo
 * @version 1.0.0
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Configuración de la aplicación Express
const app = express();
app.use(cors()); // Habilita CORS para peticiones cross-origin
app.use(bodyParser.json()); // Parsea el body de las peticiones como JSON

// ============================================================================
// CAPA DE SERVICIOS DE NEGOCIO (Business Services Layer)
// ============================================================================

/**
 * UserService - Servicio de gestión de usuarios
 * 
 * En un entorno de producción, este servicio se conectaría a una base de datos
 * o a una API externa. Para fines demostrativos, retorna datos simulados.
 * 
 * Responsabilidades:
 * - Obtener información de usuarios
 * - Crear nuevos usuarios
 * - Validar datos de usuarios (en implementación real)
 */
class UserService {
  /**
   * Obtiene un usuario por su ID
   * @param {number} id - Identificador único del usuario
   * @returns {Object} Objeto con los datos del usuario
   */
  getUser(id) {
    // En producción: SELECT * FROM users WHERE id = ?
    return { 
      id, 
      name: 'Juan Pérez', 
      email: 'juan@example.com' 
    };
  }

  /**
   * Crea un nuevo usuario en el sistema
   * @param {Object} user - Datos del usuario a crear
   * @returns {Object} Usuario creado con ID y timestamp
   */
  createUser(user) {
    // En producción: INSERT INTO users (name, email) VALUES (?, ?)
    return { 
      id: 1, 
      ...user, 
      createdAt: new Date().toISOString() 
    };
  }
}

/**
 * OrderService - Servicio de gestión de órdenes
 * 
 * Maneja todas las operaciones relacionadas con órdenes de compra.
 * En un sistema real, interactuaría con bases de datos y sistemas de pago.
 * 
 * Responsabilidades:
 * - Gestionar órdenes de compra
 * - Procesar pagos (en implementación real)
 * - Actualizar inventario (en implementación real)
 */
class OrderService {
  /**
   * Obtiene una orden por su ID
   * @param {number} id - Identificador único de la orden
   * @returns {Object} Objeto con los datos de la orden
   */
  getOrder(id) {
    // En producción: SELECT * FROM orders WHERE id = ?
    return { 
      id, 
      product: 'Laptop', 
      amount: 1200, 
      status: 'pendiente' 
    };
  }

  /**
   * Crea una nueva orden en el sistema
   * @param {Object} order - Datos de la orden a crear
   * @returns {Object} Orden creada con ID y timestamp
   */
  createOrder(order) {
    // En producción: INSERT INTO orders (product, amount) VALUES (?, ?)
    return { 
      id: 100, 
      ...order, 
      date: new Date().toISOString() 
    };
  }
}

// ============================================================================
// BUSINESS LOOKUP SERVICE
// ============================================================================

/**
 * BusinessLookup - Servicio de localización de servicios
 * 
 * Actúa como un registro centralizado de todos los servicios de negocio disponibles.
 * Implementa el patrón Service Locator para desacoplar la creación y localización
 * de servicios de su uso.
 * 
 * Ventajas:
 * - Centraliza el registro de servicios
 * - Facilita la sustitución de servicios
 * - Permite lazy loading de servicios (si se implementa)
 * - Simplifica la gestión de dependencias
 */
class BusinessLookup {
  /**
   * Constructor - Inicializa el registro de servicios
   * Aquí se crean e instancian todos los servicios disponibles
   */
  constructor() {
    // Mapa de servicios disponibles: tipo -> instancia
    this.services = {
      'user': new UserService(),   // Servicio de usuarios
      'order': new OrderService()  // Servicio de órdenes
    };
  }

  /**
   * Obtiene un servicio por su tipo
   * @param {string} type - Tipo de servicio a obtener ('user', 'order', etc.)
   * @returns {Object|null} Instancia del servicio solicitado o null si no existe
   */
  getService(type) {
    const service = this.services[type] || null;
    
    // Log para debugging (remover en producción)
    if (!service) {
      console.warn(`⚠️ Servicio '${type}' no encontrado en el registro`);
    }
    
    return service;
  }
}

// ============================================================================
// BUSINESS DELEGATE
// ============================================================================

/**
 * BusinessDelegate - Delegado de servicios de negocio
 * 
 * Este es el componente principal del patrón Business Delegate.
 * Proporciona una abstracción sobre los servicios de negocio, ocultando
 * la complejidad de la localización y comunicación con ellos.
 * 
 * Responsabilidades:
 * - Localizar servicios a través de BusinessLookup
 * - Delegar llamadas a los servicios apropiados
 * - Manejar errores de forma centralizada
 * - Proporcionar una interfaz uniforme para todos los servicios
 * 
 * Beneficios:
 * - Reduce el acoplamiento entre capas
 * - Facilita el testing (permite mock de servicios)
 * - Centraliza el manejo de errores
 * - Mejora la mantenibilidad del código
 */
class BusinessDelegate {
  /**
   * Constructor - Inicializa el delegate con un lookup service
   */
  constructor() {
    this.lookup = new BusinessLookup();  // Servicio de localización
    this.service = null;                 // Servicio actualmente seleccionado
  }

  /**
   * Configura el tipo de servicio a utilizar
   * @param {string} type - Tipo de servicio ('user', 'order', etc.)
   * @throws {Error} Si el servicio solicitado no existe
   */
  setServiceType(type) {
    // Localiza el servicio requerido
    this.service = this.lookup.getService(type);
    
    // Valida que el servicio exista
    if (!this.service) {
      throw new Error(`Servicio ${type} no encontrado`);
    }
  }

  /**
   * Obtiene datos del servicio configurado
   * @param {number} id - Identificador del recurso a obtener
   * @returns {Object} Datos solicitados
   * @throws {Error} Si no se ha configurado un servicio
   */
  getData(id) {
    // Valida que se haya configurado un servicio
    if (!this.service) {
      throw new Error('Servicio no configurado');
    }
    
    // Intenta diferentes métodos según el servicio
    // Esto proporciona flexibilidad en la interfaz de los servicios
    return this.service.getData 
      ? this.service.getData(id) 
      : this.service.get(id);
  }

  /**
   * Crea datos en el servicio configurado
   * @param {Object} data - Datos a crear
   * @returns {Object} Datos creados con metadatos adicionales
   * @throws {Error} Si no se ha configurado un servicio
   */
  createData(data) {
    // Valida que se haya configurado un servicio
    if (!this.service) {
      throw new Error('Servicio no configurado');
    }
    
    // Intenta diferentes métodos según el servicio
    return this.service.createData 
      ? this.service.createData(data) 
      : this.service.createUser(data);
  }
}

// ============================================================================
// CONTROLADORES HTTP - CAPA DE PRESENTACIÓN
// ============================================================================

/**
 * Endpoint: Obtener datos de un servicio por ID
 * 
 * Ruta: POST /api/:service/get/:id
 * 
 * Este endpoint permite obtener un recurso específico de cualquier servicio
 * registrado en el sistema. Utiliza el Business Delegate para abstraer
 * la lógica de acceso a los servicios.
 * 
 * Parámetros de ruta:
 * @param {string} service - Tipo de servicio ('user', 'order', etc.)
 * @param {number} id - Identificador del recurso a obtener
 * 
 * Respuestas:
 * - 200: Retorna los datos solicitados
 * - 404: Servicio no encontrado o recurso no existe
 * 
 * Ejemplo de uso:
 * POST http://localhost:3000/api/user/get/1
 * POST http://localhost:3000/api/order/get/100
 */
app.post('/api/:service/get/:id', (req, res) => {
  try {
    // Extrae parámetros de la ruta
    const { service, id } = req.params;
    
    // Crea una nueva instancia del delegate
    const delegate = new BusinessDelegate();
    
    // Configura el tipo de servicio a utilizar
    delegate.setServiceType(service);
    
    // Obtiene los datos del servicio
    const data = delegate.getData(parseInt(id));
    
    // Retorna los datos en formato JSON
    res.json(data);
  } catch (error) {
    // Manejo de errores: servicio no encontrado o error en la operación
    console.error('Error en GET:', error.message);
    res.status(404).json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Endpoint: Crear un nuevo recurso en un servicio
 * 
 * Ruta: POST /api/:service/create
 * 
 * Este endpoint permite crear un nuevo recurso en cualquier servicio
 * registrado. Los datos se envían en el body de la petición como JSON.
 * 
 * Parámetros de ruta:
 * @param {string} service - Tipo de servicio ('user', 'order', etc.)
 * 
 * Body:
 * @param {Object} req.body - Datos del recurso a crear (varía según servicio)
 * 
 * Respuestas:
 * - 201: Recurso creado exitosamente
 * - 400: Error en la validación o creación del recurso
 * 
 * Ejemplo de uso:
 * POST http://localhost:3000/api/user/create
 * Body: { "name": "Juan", "email": "juan@example.com" }
 * 
 * POST http://localhost:3000/api/order/create
 * Body: { "product": "Laptop", "amount": 1200 }
 */
app.post('/api/:service/create', (req, res) => {
  try {
    // Extrae el tipo de servicio de los parámetros
    const { service } = req.params;
    
    // Crea una nueva instancia del delegate
    const delegate = new BusinessDelegate();
    
    // Configura el tipo de servicio a utilizar
    delegate.setServiceType(service);
    
    // Crea el recurso con los datos del body
    const data = delegate.createData(req.body);
    
    // Retorna el recurso creado con código 201 (Created)
    res.status(201).json(data);
  } catch (error) {
    // Manejo de errores: validación fallida o error en la creación
    console.error('Error en CREATE:', error.message);
    res.status(400).json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// ============================================================================
// INICIALIZACIÓN DEL SERVIDOR
// ============================================================================

/**
 * Inicia el servidor Express en el puerto 3000
 * 
 * Una vez iniciado, el servidor estará disponible en:
 * http://localhost:3000
 * 
 * Endpoints disponibles:
 * - POST /api/user/get/:id - Obtener usuario
 * - POST /api/user/create - Crear usuario
 * - POST /api/order/get/:id - Obtener orden
 * - POST /api/order/create - Crear orden
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   Business Delegate Pattern Server        ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`);
  console.log('');
  console.log('📋 Endpoints disponibles:');
  console.log(`   POST http://localhost:${PORT}/api/user/get/:id`);
  console.log(`   POST http://localhost:${PORT}/api/user/create`);
  console.log(`   POST http://localhost:${PORT}/api/order/get/:id`);
  console.log(`   POST http://localhost:${PORT}/api/order/create`);
  console.log('');
  console.log('✨ Presiona Ctrl+C para detener el servidor');
});

// Exporta la app para testing (opcional)
module.exports = app;
