/**
 * @fileoverview Menu Service - Microservicio de Gestión de Menú
 * 
 * Este microservicio es responsable de gestionar el catálogo de productos/items
 * del menú dentro de una arquitectura de microservicios. Opera de manera independiente
 * y expone una API REST para operaciones CRUD sobre productos.
 * 
 * @description
 * Características principales:
 * - Creación de nuevos items del menú con ID único (UUID)
 * - Consulta de items por ID
 * - Gestión de precios de productos
 * - Almacenamiento en memoria (in-memory database)
 * - API RESTful con formato JSON
 * - Puerto: 3002
 * 
 * Patrón Implementado:
 * - Microservicio independiente
 * - Database per Service (base de datos propia)
 * - RESTful API
 * - Single Responsibility Principle
 * 
 * @module MenuService
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
 * Base de datos en memoria para almacenar items del menú.
 * En producción, esto debería ser reemplazado por una base de datos real
 * como MongoDB, PostgreSQL, etc.
 * 
 * Cada item contiene:
 * - id: Identificador único (UUID)
 * - name: Nombre del producto
 * - price: Precio del producto (numérico)
 * 
 * @type {Array<{id: string, name: string, price: number}>}
 */
const menu = [];

/**
 * @api {post} /menu Crear nuevo item del menú
 * @apiName CreateMenuItem
 * @apiGroup Menu
 * 
 * @apiDescription
 * Crea un nuevo producto en el catálogo del menú. Genera automáticamente un ID
 * único utilizando UUID v4 y almacena el item con su nombre y precio.
 * 
 * Flujo de ejecución:
 * 1. Recibe datos del producto (nombre y precio)
 * 2. Genera UUID único para el item
 * 3. Crea objeto MenuItem con id, name y price
 * 4. Almacena en array menu
 * 5. Retorna item creado con código 201
 * 
 * Este endpoint permite agregar productos al catálogo que luego
 * pueden ser utilizados en las órdenes de compra.
 * 
 * @apiParam {String} name Nombre del producto (obligatorio)
 * @apiParam {Number} price Precio del producto (obligatorio)
 * 
 * @apiParamExample {json} Request-Example:
 *     {
 *       "name": "Pizza Margherita",
 *       "price": 150
 *     }
 * 
 * @apiSuccess {String} id ID único del producto (UUID)
 * @apiSuccess {String} name Nombre del producto
 * @apiSuccess {Number} price Precio del producto
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
 *       "name": "Pizza Margherita",
 *       "price": 150
 *     }
 * 
 * @apiError (400) {String} error Error en los datos proporcionados
 */
app.post("/menu", (req, res) => {
  // Crear objeto item con ID único, nombre y precio
  const item = {
    id: uuid(), // Generar UUID v4 único
    name: req.body.name,
    price: req.body.price
  };

  // Almacenar item en la base de datos en memoria
  menu.push(item);
  
  // Retornar item creado con código 201 (Created)
  res.status(201).json(item);
});

/**
 * @api {get} /menu/:id Obtener item del menú por ID
 * @apiName GetMenuItem
 * @apiGroup Menu
 * 
 * @apiDescription
 * Obtiene la información de un producto específico del menú por su ID.
 * Busca en la base de datos en memoria y retorna los datos del item
 * si existe, o un error 404 si no se encuentra.
 * 
 * Flujo de ejecución:
 * 1. Recibe ID del producto desde parámetros de ruta
 * 2. Busca item en array menu
 * 3. Si existe, retorna datos con código 200
 * 4. Si no existe, retorna error 404
 * 
 * Este endpoint es utilizado por otros microservicios (como Order Service)
 * para validar la existencia de productos y obtener su precio antes de
 * crear órdenes de compra.
 * 
 * Comunicación inter-servicios:
 * - Order Service consulta este endpoint para validar menuId
 * - Order Service obtiene el precio del producto para calcular el total
 * 
 * @apiParam {String} id ID único del producto (UUID)
 * 
 * @apiSuccess {String} id ID único del producto
 * @apiSuccess {String} name Nombre del producto
 * @apiSuccess {Number} price Precio del producto
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
 *       "name": "Pizza Margherita",
 *       "price": 150
 *     }
 * 
 * @apiError (404) {String} error Mensaje de error cuando el item no existe
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Item not found"
 *     }
 */
app.get("/menu/:id", (req, res) => {
  // Buscar item por ID en la base de datos
  const item = menu.find(m => m.id === req.params.id);
  
  // Si no existe, retornar error 404
  if (!item) return res.status(404).json({ error: "Item not found" });

  // Retornar datos del item
  res.json(item);
});

/**
 * Iniciar servidor en el puerto 3002
 * 
 * El servicio escucha en el puerto 3002 y está listo para recibir peticiones HTTP.
 * En una arquitectura de microservicios, cada servicio debe tener su propio puerto.
 * 
 * Puertos utilizados en el sistema:
 * - 3001: Customer Service
 * - 3002: Menu Service (este servicio)
 * - 3003: Order Service
 */
app.listen(3002, () => {
  console.log("╔══════════════════════════════════════════╗");
  console.log("║   Menu Service - Microservicio          ║");
  console.log("║   Puerto: 3002                          ║");
  console.log("║   Estado: ✅ Activo                      ║");
  console.log("╚══════════════════════════════════════════╝");
  console.log("");
  console.log("📋 Endpoints disponibles:");
  console.log("   POST   /menu      - Crear producto");
  console.log("   GET    /menu/:id  - Obtener producto");
  console.log("");
});