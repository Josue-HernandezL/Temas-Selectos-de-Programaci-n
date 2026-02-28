/**
 * @fileoverview Order Service - Microservicio de Gestión de Órdenes
 * 
 * Este microservicio es el orquestador central del sistema que coordina
 * la creación de órdenes validando información con otros microservicios.
 * Implementa el patrón de Orchestration para comunicación síncrona.
 * 
 * @description
 * Características principales:
 * - Creación de órdenes validando cliente y producto
 * - Comunicación HTTP con otros microservicios (Customer y Menu)
 * - Listado de todas las órdenes creadas
 * - Cálculo automático de totales
 * - Manejo de errores en comunicación entre servicios
 * - Almacenamiento en memoria (in-memory database)
 * - API RESTful con formato JSON
 * - Puerto: 3003
 * 
 * Patrón Implementado:
 * - Service Orchestration (Orquestación de servicios)
 * - Synchronous Communication (HTTP/REST)
 * - Database per Service
 * - Error Handling Pattern
 * 
 * Dependencias de Servicios:
 * - Customer Service (localhost:3001) - Validación de clientes
 * - Menu Service (localhost:3002) - Validación de productos y precios
 * 
 * @module OrderService
 * @requires express - Framework web para Node.js
 * @requires axios - Cliente HTTP para comunicación entre servicios
 * @requires uuid - Generador de identificadores únicos
 * 
 * @author Sistema de Microservicios
 * @version 1.0.0
 */

const express = require("express");
const axios = require("axios");
const { v4: uuid } = require("uuid");

// Inicializar aplicación Express
const app = express();

// Middleware para parsear JSON en las peticiones
app.use(express.json());

/**
 * Base de datos en memoria para almacenar órdenes.
 * En producción, esto debería ser reemplazado por una base de datos real
 * como MongoDB, PostgreSQL, etc.
 * 
 * Cada orden contiene:
 * - id: Identificador único (UUID)
 * - customer: Objeto completo del cliente
 * - item: Objeto completo del producto
 * - total: Precio total de la orden
 * - createdAt: Fecha y hora de creación
 * 
 * @type {Array<{id: string, customer: Object, item: Object, total: number, createdAt: Date}>}
 */
const orders = [];

/**
 * @api {post} /orders Crear nueva orden
 * @apiName CreateOrder
 * @apiGroup Orders
 * 
 * @apiDescription
 * Crea una nueva orden en el sistema coordinando con otros microservicios.
 * Este endpoint implementa el patrón de Orchestration, donde el Order Service
 * actúa como orquestador que coordina la validación con Customer Service y
 * Menu Service antes de crear la orden.
 * 
 * Flujo de ejecución (Service Orchestration):
 * 1. Recibe customerId y menuId del cliente
 * 2. 🌐 Llama a Customer Service para validar que el cliente existe
 * 3. 🌐 Llama a Menu Service para validar que el producto existe y obtener precio
 * 4. Genera UUID único para la orden
 * 5. Crea objeto Order con toda la información agregada
 * 6. Calcula el total basado en el precio del producto
 * 7. Almacena la orden en la base de datos
 * 8. Retorna orden completa con código 201
 * 
 * Comunicación Inter-Servicios:
 * - GET http://localhost:3001/customers/:id - Validar cliente
 * - GET http://localhost:3002/menu/:id - Validar producto y obtener precio
 * 
 * Manejo de Errores:
 * - Si Customer Service retorna 404: Error 400 "Servicio Fallo"
 * - Si Menu Service retorna 404: Error 400 "Servicio Fallo"
 * - Si hay error de red: Error 400 "Servicio Fallo"
 * 
 * En producción, se debería implementar:
 * - Circuit Breaker Pattern (Hystrix, Opossum)
 * - Retry Logic (axios-retry)
 * - Timeout Configuration
 * - Service Discovery (Consul, Eureka)
 * - Message Queues para comunicación asíncrona (RabbitMQ, Kafka)
 * 
 * @apiParam {String} customerId ID del cliente (UUID)
 * @apiParam {String} menuId ID del producto del menú (UUID)
 * 
 * @apiParamExample {json} Request-Example:
 *     {
 *       "customerId": "550e8400-e29b-41d4-a716-446655440000",
 *       "menuId": "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
 *     }
 * 
 * @apiSuccess {String} id ID único de la orden (UUID)
 * @apiSuccess {Object} customer Objeto completo del cliente
 * @apiSuccess {String} customer.id ID del cliente
 * @apiSuccess {String} customer.name Nombre del cliente
 * @apiSuccess {Object} item Objeto completo del producto
 * @apiSuccess {String} item.id ID del producto
 * @apiSuccess {String} item.name Nombre del producto
 * @apiSuccess {Number} item.price Precio del producto
 * @apiSuccess {Number} total Total de la orden (igual al precio del producto)
 * @apiSuccess {Date} createdAt Fecha y hora de creación de la orden
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
 *       "customer": {
 *         "id": "550e8400-e29b-41d4-a716-446655440000",
 *         "name": "Juan Pérez"
 *       },
 *       "item": {
 *         "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
 *         "name": "Pizza Margherita",
 *         "price": 150
 *       },
 *       "total": 150,
 *       "createdAt": "2026-02-28T12:30:00.000Z"
 *     }
 * 
 * @apiError (400) {String} error Mensaje de error cuando falla la validación
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Servicio Fallo"
 *     }
 */
app.post("/orders", async (req, res) => {
  try {
    // Extraer IDs del cuerpo de la petición
    const { customerId, menuId } = req.body;

    // ============================================
    // Paso 1: Validar que el cliente existe
    // ============================================
    // Comunicación síncrona con Customer Service
    // Si el cliente no existe, este lanzará un error 404
    const customerResponse = await axios.get(
      `http://localhost:3001/customers/${customerId}`
    );

    // ============================================
    // Paso 2: Validar que el producto existe y obtener su precio
    // ============================================
    // Comunicación síncrona con Menu Service
    // Si el producto no existe, este lanzará un error 404
    const menuResponse = await axios.get(
      `http://localhost:3002/menu/${menuId}`
    );

    // ============================================
    // Paso 3: Crear la orden con todos los datos agregados
    // ============================================
    const order = {
      id: uuid(), // Generar UUID único para la orden
      customer: customerResponse.data, // Datos completos del cliente
      item: menuResponse.data, // Datos completos del producto
      total: menuResponse.data.price, // Calcular total basado en el precio
      createdAt: new Date() // Timestamp de creación
    };

    // ============================================
    // Paso 4: Almacenar la orden en la base de datos
    // ============================================
    orders.push(order);

    // ============================================
    // Paso 5: Retornar la orden creada
    // ============================================
    res.status(201).json(order);

  } catch (error) {
    // ============================================
    // Manejo de Errores
    // ============================================
    // Captura errores de:
    // - Cliente no encontrado (404 de Customer Service)
    // - Producto no encontrado (404 de Menu Service)
    // - Errores de red o timeout
    // - Servicios no disponibles
    
    // En producción, se debería:
    // 1. Loggear el error completo para debugging
    // 2. Implementar Circuit Breaker para prevenir cascada de fallos
    // 3. Retornar mensajes de error más específicos
    // 4. Implementar retry logic para reintentos automáticos
    
    res.status(400).json({
      error: "Servicio Fallo"
    });
  }
});

/**
 * @api {get} /orders Listar todas las órdenes
 * @apiName GetOrders
 * @apiGroup Orders
 * 
 * @apiDescription
 * Obtiene un listado de todas las órdenes creadas en el sistema.
 * Cada orden incluye la información completa del cliente y producto.
 * 
 * Este endpoint es útil para:
 * - Visualizar historial de órdenes
 * - Generar reportes
 * - Auditoría del sistema
 * - Dashboard administrativo
 * 
 * @apiSuccess {Array} orders Array de órdenes
 * @apiSuccess {String} orders.id ID único de la orden
 * @apiSuccess {Object} orders.customer Datos del cliente
 * @apiSuccess {Object} orders.item Datos del producto
 * @apiSuccess {Number} orders.total Total de la orden
 * @apiSuccess {Date} orders.createdAt Fecha de creación
 * 
 * @apiSuccessExample {json} Success-Response (con datos):
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
 *         "customer": {
 *           "id": "550e8400-e29b-41d4-a716-446655440000",
 *           "name": "Juan Pérez"
 *         },
 *         "item": {
 *           "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
 *           "name": "Pizza Margherita",
 *           "price": 150
 *         },
 *         "total": 150,
 *         "createdAt": "2026-02-28T12:30:00.000Z"
 *       }
 *     ]
 * 
 * @apiSuccessExample {json} Success-Response (sin datos):
 *     HTTP/1.1 200 OK
 *     []
 */
app.get("/orders", (req, res) => {
  // Retornar todas las órdenes almacenadas
  res.json(orders);
});

/**
 * Iniciar servidor en el puerto 3003
 * 
 * El servicio escucha en el puerto 3003 y está listo para recibir peticiones HTTP.
 * Este servicio actúa como orquestador y se comunica con los otros servicios.
 * 
 * Puertos utilizados en el sistema:
 * - 3001: Customer Service (dependencia)
 * - 3002: Menu Service (dependencia)
 * - 3003: Order Service (este servicio - orquestador)
 * 
 * Nota importante:
 * Este servicio requiere que Customer Service y Menu Service estén ejecutándose
 * antes de poder crear órdenes. Si alguno de los servicios no está disponible,
 * las peticiones POST /orders fallarán con error 400.
 */
app.listen(3003, () => {
  console.log("╔══════════════════════════════════════════╗");
  console.log("║   Order Service - Orquestador           ║");
  console.log("║   Puerto: 3003                          ║");
  console.log("║   Estado: ✅ Activo                      ║");
  console.log("╚══════════════════════════════════════════╝");
  console.log("");
  console.log("📋 Endpoints disponibles:");
  console.log("   POST   /orders  - Crear orden (orquesta servicios)");
  console.log("   GET    /orders  - Listar todas las órdenes");
  console.log("");
  console.log("🔗 Dependencias:");
  console.log("   → Customer Service (localhost:3001)");
  console.log("   → Menu Service     (localhost:3002)");
  console.log("");
});