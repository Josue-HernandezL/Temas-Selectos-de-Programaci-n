/**
 * Notification Dispatcher - Núcleo del Patrón Dispatcher
 * 
 * Este módulo implementa la lógica central del patrón Dispatcher.
 * Recibe las solicitudes de notificación y las despacha al handler apropiado
 * basándose en el tipo de notificación solicitado.
 * 
 * Responsabilidades:
 * 1. Extraer el tipo y payload de la solicitud
 * 2. Validar que el tipo de notificación sea válido
 * 3. Obtener el handler correspondiente del registro
 * 4. Ejecutar el handler con el payload proporcionado
 * 5. Manejar errores y excepciones
 * 6. Enviar la respuesta apropiada al cliente
 * 
 * Beneficios del patrón:
 * - Punto único de despacho
 * - Lógica de enrutamiento centralizada
 * - Fácil agregar nuevos tipos de notificaciones
 * - Manejo uniforme de errores
 * - Separación de responsabilidades
 * 
 * @module notificationDispatcher
 */

const handlers = require('./handlers');

/**
 * Función principal del dispatcher
 * 
 * Esta función es el corazón del patrón Dispatcher. Recibe una solicitud HTTP,
 * determina qué handler debe procesarla, ejecuta ese handler y retorna la respuesta.
 * 
 * Flujo de ejecución:
 * 1. Extraer {type, payload} del body de la solicitud
 * 2. Buscar el handler correspondiente al tipo en el registro
 * 3. Si no existe el handler → Error 400
 * 4. Si existe → Ejecutar handler con el payload
 * 5. Retornar resultado exitoso → 200 OK
 * 6. Si hay excepciones → Error 500
 * 
 * @async
 * @function dispatch
 * @param {Object} req - Objeto request de Express
 * @param {Object} req.body - Body de la petición
 * @param {string} req.body.type - Tipo de notificación (email, sms, push)
 * @param {Object} req.body.payload - Datos de la notificación
 * @param {Object} res - Objeto response de Express
 * 
 * @returns {Promise<void>}
 * 
 * @example
 * // Solicitud exitosa
 * POST /notify
 * Body: {
 *   "type": "email",
 *   "payload": {
 *     "to": "usuario@example.com",
 *     "message": "Hola mundo"
 *   }
 * }
 * 
 * Response: {
 *   "success": true,
 *   "method": "email",
 *   "details": {
 *     "id": 1709054400000,
 *     "provider": "gmail"
 *   }
 * }
 * 
 * @example
 * // Tipo de notificación inválido
 * POST /notify
 * Body: {
 *   "type": "telegram",
 *   "payload": {...}
 * }
 * 
 * Response: 400 Bad Request
 * {
 *   "error": "El tipo de notificación 'telegram' no es válido. Opciones: email, sms, push"
 * }
 */
const dispatch = async (req, res) => {
    try {
        // ====================================================================
        // 1. EXTRACCIÓN DE DATOS
        // ====================================================================
        
        /**
         * Extrae el tipo de notificación y el payload del body
         * - type: Determina qué handler se utilizará (email, sms, push)
         * - payload: Contiene los datos específicos para el tipo de notificación
         */
        const { type, payload } = req.body;

        // Log para debugging (puede removerse en producción)
        console.log(`📨 Solicitud de notificación recibida: tipo='${type}'`);

        // ====================================================================
        // 2. BÚSQUEDA DEL HANDLER
        // ====================================================================
        
        /**
         * Busca el handler correspondiente en el registro de handlers
         * 
         * El registro (handlers) es un objeto que mapea tipos a funciones:
         * {
         *   'email': sendEmail,
         *   'sms': sendSMS,
         *   'push': sendPush
         * }
         */
        const handler = handlers[type];

        // ====================================================================
        // 3. VALIDACIÓN DEL HANDLER
        // ====================================================================
        
        /**
         * Verifica que el handler exista
         * Si no existe, significa que el tipo de notificación no es válido
         */
        if (!handler) {
            console.warn(`⚠️  Tipo de notificación no válido: '${type}'`);
            
            return res.status(400).json({ 
                error: `El tipo de notificación '${type}' no es válido. Opciones: email, sms, push`,
                timestamp: new Date().toISOString()
            });
        }

        // ====================================================================
        // 4. EJECUCIÓN DEL HANDLER
        // ====================================================================
        
        /**
         * Ejecuta el handler correspondiente con el payload
         * 
         * Cada handler es una función asíncrona que:
         * - Procesa la notificación
         * - Retorna un objeto con el resultado
         * 
         * El await espera a que el handler complete su tarea
         */
        console.log(`⚙️  Ejecutando handler para tipo: '${type}'`);
        const result = await handler(payload);

        // ====================================================================
        // 5. RESPUESTA EXITOSA
        // ====================================================================
        
        /**
         * Construye y envía la respuesta exitosa al cliente
         * 
         * Estructura de respuesta:
         * - success: Indica que la operación fue exitosa
         * - method: El tipo de notificación procesado
         * - details: Información detallada del resultado (ID, proveedor, etc.)
         */
        console.log(`✅ Notificación '${type}' procesada exitosamente`);
        
        res.json({
            success: true,
            method: type,
            details: result
        });

    } catch (error) {
        // ====================================================================
        // 6. MANEJO DE ERRORES
        // ====================================================================
        
        /**
         * Captura cualquier error que ocurra durante el proceso
         * 
         * Posibles errores:
         * - Error en la ejecución del handler
         * - Error de conexión con proveedores externos
         * - Errores de validación de payload
         * - Cualquier excepción no capturada
         */
        console.error('❌ Error procesando la notificación:', error.message);
        console.error('Stack trace:', error.stack);
        
        res.status(500).json({ 
            error: 'Error interno procesando la notificación',
            timestamp: new Date().toISOString()
        });
    }
};

// Exporta la función dispatch como módulo
module.exports = dispatch;