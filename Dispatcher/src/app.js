/**
 * Dispatcher Pattern - Sistema de Notificaciones
 * 
 * Este archivo es el punto de entrada de la aplicación. Implementa el patrón Dispatcher
 * que centraliza el enrutamiento de notificaciones a través de un único endpoint.
 * 
 * El patrón Dispatcher:
 * - Recibe todas las solicitudes en un punto único
 * - Despacha cada solicitud al handler apropiado
 * - Maneja errores de forma centralizada
 * - Simplifica el enrutamiento de la aplicación
 * 
 * Arquitectura:
 * Cliente → Express App → Notification Dispatcher → Handlers → Proveedores
 * 
 * @author Proyecto educativo
 * @version 1.0.0
 */

const express = require('express');
const notificationDispatcher = require('./notificationDispatcher');

// Inicializa la aplicación Express
const app = express();

// ============================================================================
// CONFIGURACIÓN DE MIDDLEWARES
// ============================================================================

/**
 * Middleware para parsear JSON en el body de las peticiones
 * Permite recibir datos en formato JSON desde el cliente
 */
app.use(express.json());

// ============================================================================
// DEFINICIÓN DE RUTAS - PUNTO ÚNICO DE ENTRADA
// ============================================================================

/**
 * Ruta única para todas las notificaciones
 * 
 * Endpoint: POST /notify
 * 
 * Este es el núcleo del patrón Dispatcher. Todas las notificaciones,
 * independientemente de su tipo (email, SMS, push), llegan a esta ruta.
 * El dispatcher se encarga de dirigir cada solicitud al handler correcto.
 * 
 * Body esperado:
 * {
 *   "type": "email" | "sms" | "push",
 *   "payload": {
 *     // Datos específicos del tipo de notificación
 *   }
 * }
 * 
 * Tipos soportados:
 * - email: Envía correos electrónicos
 * - sms: Envía mensajes de texto
 * - push: Envía notificaciones push
 * 
 * @route POST /notify
 * @param {string} type - Tipo de notificación (email, sms, push)
 * @param {Object} payload - Datos de la notificación
 * @returns {Object} 200 - {success: true, method: string, details: Object}
 * @returns {Object} 400 - {error: string} - Tipo de notificación no válido
 * @returns {Object} 500 - {error: string} - Error interno del servidor
 */
app.post('/notify', notificationDispatcher);

// ============================================================================
// INICIALIZACIÓN DEL SERVIDOR
// ============================================================================

/**
 * Puerto en el que escuchará el servidor
 * Se puede configurar mediante variable de entorno PORT
 */
const PORT = process.env.PORT || 3000;

/**
 * Inicia el servidor Express
 * 
 * Una vez iniciado, el servidor estará listo para recibir peticiones
 * de notificaciones en http://localhost:3000/notify
 */
app.listen(PORT, () => {
    console.log('╔════════════════════════════════════════════╗');
    console.log('║   Dispatcher Pattern - Notifications      ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
    console.log('');
    console.log('📋 Endpoint disponible:');
    console.log(`   POST http://localhost:${PORT}/notify`);
    console.log('');
    console.log('📧 Tipos de notificación soportados:');
    console.log('   • email - Correo electrónico (Gmail)');
    console.log('   • sms   - Mensaje de texto (Twilio)');
    console.log('   • push  - Notificación push (Firebase)');
    console.log('');
    console.log('✨ Presiona Ctrl+C para detener el servidor');
});

// Exporta la app para testing (opcional)
module.exports = app;