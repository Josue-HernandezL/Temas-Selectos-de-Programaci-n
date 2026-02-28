/**
 * Handlers Registry - Manejadores de Notificaciones
 * 
 * Este módulo contiene los handlers (manejadores) para cada tipo de notificación.
 * Cada handler es una función asíncrona responsable de procesar un tipo específico
 * de notificación.
 * 
 * Arquitectura:
 * - Cada handler es independiente y puede ser testeado por separado
 * - Los handlers siguen una interfaz común: reciben payload y retornan resultado
 * - En producción, estos handlers se conectarían a servicios reales (APIs externas)
 * 
 * Patrones implementados:
 * - Strategy Pattern: Cada handler es una estrategia de notificación
 * - Registry Pattern: Los handlers se exportan como un registro
 * 
 * @module handlers
 */

// ============================================================================
// EMAIL HANDLER - Notificaciones por Correo Electrónico
// ============================================================================

/**
 * Envía notificaciones por correo electrónico
 * 
 * En un entorno de producción, este handler se conectaría a un servicio
 * de email real como:
 * - SendGrid
 * - AWS SES
 * - Mailgun
 * - Gmail API
 * 
 * Actualmente simula el envío mostrando un log en consola.
 * 
 * @async
 * @function sendEmail
 * @param {Object} payload - Datos del correo a enviar
 * @param {string} payload.to - Dirección de email del destinatario
 * @param {string} payload.message - Mensaje del correo
 * @param {string} [payload.subject] - Asunto del correo (opcional)
 * @param {string} [payload.from] - Email del remitente (opcional)
 * 
 * @returns {Promise<Object>} Resultado del envío
 * @returns {number} return.id - Identificador único del envío (timestamp)
 * @returns {string} return.provider - Proveedor utilizado ('gmail')
 * 
 * @example
 * const result = await sendEmail({
 *   to: 'usuario@example.com',
 *   message: 'Bienvenido a nuestra plataforma'
 * });
 * // { id: 1709054400000, provider: 'gmail' }
 */
const sendEmail = async (payload) => {
    // Log del envío (en producción, esto sería una llamada API real)
    console.log(`📧 Enviando email a ${payload.to}: "${payload.message}"`);
    
    // Simulación de envío (en producción: await emailService.send(payload))
    // await gmailAPI.send({ to: payload.to, message: payload.message });
    
    // Retorna información del envío
    return { 
        id: Date.now(),           // ID único basado en timestamp
        provider: 'gmail',        // Proveedor de email
        to: payload.to,           // Destinatario
        sentAt: new Date().toISOString()  // Fecha y hora de envío
    };
};

// ============================================================================
// SMS HANDLER - Notificaciones por Mensaje de Texto
// ============================================================================

/**
 * Envía notificaciones por mensaje de texto (SMS)
 * 
 * En un entorno de producción, este handler se conectaría a un servicio
 * de SMS real como:
 * - Twilio
 * - AWS SNS
 * - Vonage (Nexmo)
 * - MessageBird
 * 
 * Actualmente simula el envío mostrando un log en consola.
 * 
 * @async
 * @function sendSMS
 * @param {Object} payload - Datos del SMS a enviar
 * @param {string} payload.phone - Número de teléfono del destinatario (formato internacional)
 * @param {string} payload.message - Mensaje de texto a enviar (máx. 160 caracteres)
 * @param {string} [payload.from] - Número remitente (opcional)
 * 
 * @returns {Promise<Object>} Resultado del envío
 * @returns {number} return.id - Identificador único del envío (timestamp)
 * @returns {string} return.provider - Proveedor utilizado ('twilio')
 * 
 * @example
 * const result = await sendSMS({
 *   phone: '+52 55 1234 5678',
 *   message: 'Tu código de verificación es: 123456'
 * });
 * // { id: 1709054400000, provider: 'twilio' }
 */
const sendSMS = async (payload) => {
    // Log del envío (en producción, esto sería una llamada API real)
    console.log(`📱 Enviando SMS a ${payload.phone}: "${payload.message}"`);
    
    // Simulación de envío (en producción: await twilioClient.messages.create())
    // await twilioClient.messages.create({
    //     body: payload.message,
    //     to: payload.phone,
    //     from: process.env.TWILIO_PHONE_NUMBER
    // });
    
    // Retorna información del envío
    return { 
        id: Date.now(),           // ID único basado en timestamp
        provider: 'twilio',       // Proveedor de SMS
        phone: payload.phone,     // Número destinatario
        sentAt: new Date().toISOString()  // Fecha y hora de envío
    };
};

// ============================================================================
// PUSH NOTIFICATION HANDLER - Notificaciones Push
// ============================================================================

/**
 * Envía notificaciones push a dispositivos móviles
 * 
 * En un entorno de producción, este handler se conectaría a un servicio
 * de notificaciones push real como:
 * - Firebase Cloud Messaging (FCM)
 * - Apple Push Notification Service (APNS)
 * - OneSignal
 * - Amazon SNS
 * 
 * Actualmente simula el envío mostrando un log en consola.
 * 
 * @async
 * @function sendPush
 * @param {Object} payload - Datos de la notificación push
 * @param {string} payload.noti - Token del dispositivo destinatario
 * @param {string} payload.message - Mensaje de la notificación
 * @param {string} [payload.title] - Título de la notificación (opcional)
 * @param {Object} [payload.data] - Datos adicionales (opcional)
 * 
 * @returns {Promise<Object>} Resultado del envío
 * @returns {number} return.id - Identificador único del envío (timestamp)
 * @returns {string} return.provider - Proveedor utilizado ('firebase')
 * 
 * @example
 * const result = await sendPush({
 *   noti: 'device_token_abc123',
 *   message: 'Tienes un nuevo mensaje',
 *   title: 'Nueva Notificación'
 * });
 * // { id: 1709054400000, provider: 'firebase' }
 */
const sendPush = async (payload) => {
    // Log del envío (en producción, esto sería una llamada API real)
    console.log(`🔔 Enviando push a ${payload.noti}: "${payload.message}"`);
    
    // Simulación de envío (en producción: await admin.messaging().send())
    // await admin.messaging().send({
    //     token: payload.noti,
    //     notification: {
    //         title: payload.title || 'Notificación',
    //         body: payload.message
    //     },
    //     data: payload.data || {}
    // });
    
    // Retorna información del envío
    return { 
        id: Date.now(),           // ID único basado en timestamp
        provider: 'firebase',     // Proveedor de push notifications
        deviceToken: payload.noti, // Token del dispositivo
        sentAt: new Date().toISOString()  // Fecha y hora de envío
    };
};

// ============================================================================
// REGISTRO DE HANDLERS
// ============================================================================

/**
 * Exporta el registro de handlers
 * 
 * Este objeto mapea cada tipo de notificación a su handler correspondiente.
 * El dispatcher utiliza este registro para encontrar el handler apropiado.
 * 
 * Estructura:
 * {
 *   'email': Function,  // Handler para emails
 *   'sms': Function,    // Handler para SMS
 *   'push': Function    // Handler para push notifications
 * }
 * 
 * Para agregar un nuevo tipo de notificación:
 * 1. Crear la función handler (ej: sendWhatsApp)
 * 2. Agregarla al objeto de exportación
 * 3. ¡Listo! El dispatcher la reconocerá automáticamente
 * 
 * @type {Object<string, Function>}
 */
module.exports = {
    email: sendEmail,    // Mapea 'email' → sendEmail
    sms: sendSMS,        // Mapea 'sms' → sendSMS
    push: sendPush       // Mapea 'push' → sendPush
};