/**
 * @fileoverview Customer Service - Microservicio de Gestión de Clientes
 * 
 * Este microservicio es responsable de gestionar la información de los clientes
 * dentro de una arquitectura de microservicios. Opera de manera independiente
 * y expone una API REST para operaciones CRUD sobre clientes.
 * 
 * @description
 * Características principales:
 * - Creación de nuevos clientes con ID único (UUID)
 * - Consulta de clientes por ID
 * - Almacenamiento en memoria (in-memory database)
 * - API RESTful con formato JSON
 * - Puerto: 3001
 * 
 * Patrón Implementado:
 * - Microservicio independiente
 * - Database per Service (base de datos propia)
 * - RESTful API
 * 
 * @module CustomerService
 * @requires express - Framework web para Node.js
 * @requires uuid - Generador de identificadores únicos
 * 
 * @author Sistema de Microservicios
 * @version 1.0.0
 */

const express = require("express");
const { v4: uuid } = require("uuid");

// Inicializar aplicación Express
const app = express();

// Middleware para parsear JSON en las peticiones
app.use(express.json());

/**
 * Base de datos en memoria para almacenar clientes.
 * En producción, esto debería ser reemplazado por una base de datos real
 * como MongoDB, PostgreSQL, etc.
 * 
 * @type {Array<{id: string, name: string}>}
 */
const customers = [];

/**
 * @api {post} /customers Crear nuevo cliente
 * @apiName CreateCustomer
 * @apiGroup Customers
 * 
 * @apiDescription
 * Crea un nuevo cliente en el sistema. Genera automáticamente un ID único
 * utilizando UUID v4 y almacena el cliente en la base de datos en memoria.
 * 
 * Flujo de ejecución:
 * 1. Recibe datos del cliente (nombre)
 * 2. Genera UUID único para el cliente
 * 3. Crea objeto Customer con id y name
 * 4. Almacena en array customers
 * 5. Retorna cliente creado con código 201
 * 
 * @apiParam {String} name Nombre del cliente (obligatorio)
 * 
 * @apiParamExample {json} Request-Example:
 *     {
 *       "name": "Juan Pérez"
 *     }
 * 
 * @apiSuccess {String} id ID único del cliente (UUID)
 * @apiSuccess {String} name Nombre del cliente
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "id": "550e8400-e29b-41d4-a716-446655440000",
 *       "name": "Juan Pérez"
 *     }
 * 
 * @apiError (400) {String} error Error en los datos proporcionados
 */
app.post("/customers", (req, res) => {
  // Crear objeto customer con ID único y nombre
  const customer = {
    id: uuid(), // Generar UUID v4 único
    name: req.body.name
  };

  // Almacenar cliente en la base de datos en memoria
  customers.push(customer);
  
  // Retornar cliente creado con código 201 (Created)
  res.status(201).json(customer);
});

/**
 * @api {get} /customers/:id Obtener cliente por ID
 * @apiName GetCustomer
 * @apiGroup Customers
 * 
 * @apiDescription
 * Obtiene la información de un cliente específico por su ID.
 * Busca en la base de datos en memoria y retorna los datos del cliente
 * si existe, o un error 404 si no se encuentra.
 * 
 * Flujo de ejecución:
 * 1. Recibe ID del cliente desde parámetros de ruta
 * 2. Busca cliente en array customers
 * 3. Si existe, retorna datos con código 200
 * 4. Si no existe, retorna error 404
 * 
 * Este endpoint es utilizado por otros microservicios (como Order Service)
 * para validar la existencia de clientes antes de crear órdenes.
 * 
 * @apiParam {String} id ID único del cliente (UUID)
 * 
 * @apiSuccess {String} id ID único del cliente
 * @apiSuccess {String} name Nombre del cliente
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "550e8400-e29b-41d4-a716-446655440000",
 *       "name": "Juan Pérez"
 *     }
 * 
 * @apiError (404) {String} error Mensaje de error cuando el cliente no existe
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Customer not found"
 *     }
 */
app.get("/customers/:id", (req, res) => {
  // Buscar cliente por ID en la base de datos
  const customer = customers.find(c => c.id === req.params.id);
  
  // Si no existe, retornar error 404
  if (!customer) return res.status(404).json({ error: "Customer not found" });

  // Retornar datos del cliente
  res.json(customer);
});

/**
 * Iniciar servidor en el puerto 3001
 * 
 * El servicio escucha en el puerto 3001 y está listo para recibir peticiones HTTP.
 * En una arquitectura de microservicios, cada servicio debe tener su propio puerto.
 * 
 * Puertos utilizados en el sistema:
 * - 3001: Customer Service (este servicio)
 * - 3002: Menu Service
 * - 3003: Order Service
 */
app.listen(3001, () => {
  console.log("╔══════════════════════════════════════════╗");
  console.log("║   Customer Service - Microservicio      ║");
  console.log("║   Puerto: 3001                          ║");
  console.log("║   Estado: ✅ Activo                      ║");
  console.log("╚══════════════════════════════════════════╝");
  console.log("");
  console.log("📋 Endpoints disponibles:");
  console.log("   POST   /customers      - Crear cliente");
  console.log("   GET    /customers/:id  - Obtener cliente");
  console.log("");
});