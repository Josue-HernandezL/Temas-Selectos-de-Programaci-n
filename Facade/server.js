/**
 * Facade Pattern - Sistema de Reservas de Barbería "PrimeCorte"
 * 
 * Este archivo implementa el patrón de diseño Facade para simplificar
 * la interacción con múltiples subsistemas complejos en un sistema de
 * reservas de barbería.
 * 
 * El patrón Facade:
 * - Proporciona una interfaz unificada y simple para un conjunto de subsistemas
 * - Oculta la complejidad de las interacciones entre subsistemas
 * - Reduce el acoplamiento entre clientes y subsistemas
 * - Facilita el uso del sistema y mejora la mantenibilidad
 * 
 * Arquitectura:
 * Cliente (Controller) → Facade (BookingFacade) → Subsistemas (Services)
 * 
 * Subsistemas:
 * 1. AppointmentService - Gestión de citas y disponibilidad
 * 2. PaymentService - Procesamiento de pagos
 * 3. NotificationService - Envío de notificaciones
 * 
 * @author Proyecto educativo
 * @version 1.0.0
 */

const express = require('express');

// ============================================================================
// CAPA 1: SUBSISTEMAS - La Lógica Compleja
// ============================================================================
// Estos son los servicios que realizan el trabajo pesado. En un sistema real,
// cada uno se conectaría a bases de datos, APIs externas, etc.

/**
 * AppointmentService - Servicio de Gestión de Citas
 * 
 * Este servicio maneja todo lo relacionado con el agendamiento de citas
 * y la verificación de disponibilidad de los barberos.
 * 
 * En un sistema de producción, este servicio:
 * - Se conectaría a una base de datos (PostgreSQL, MongoDB, etc.)
 * - Manejaría horarios complejos y calendario
 * - Gestionaría bloqueos de tiempo
 * - Implementaría lógica de cancelaciones y reagendamiento
 * 
 * Responsabilidades:
 * - Verificar disponibilidad de barberos
 * - Agendar nuevas citas
 * - Gestionar conflictos de horarios
 * 
 * @class AppointmentService
 */
class AppointmentService {
    /**
     * Verifica si un barbero está disponible en una fecha/hora específica
     * 
     * En producción, esta función:
     * - Consultaría la base de datos para verificar citas existentes
     * - Verificaría el horario laboral del barbero
     * - Comprobaría días libres o vacaciones
     * - Validaría que la fecha sea futura
     * 
     * @param {string} barberId - Identificador único del barbero
     * @param {string} date - Fecha y hora de la cita deseada (formato: "YYYY-MM-DD HH:mm")
     * @returns {boolean} true si el barbero está disponible, false en caso contrario
     * 
     * @example
     * const available = service.checkAvailability("barber123", "2026-03-15 10:00");
     * // En producción: SELECT COUNT(*) FROM appointments WHERE barber_id = ? AND date = ?
     */
    checkAvailability(barberId, date) {
        console.log(`[Citas] 📅 Verificando disponibilidad del barbero ${barberId} para el ${date}...`);
        
        // Simulación: En este ejemplo, el barbero siempre está disponible
        // En producción: return db.appointments.isAvailable(barberId, date);
        return true; 
    }

    /**
     * Agenda una nueva cita en el sistema
     * 
     * En producción, esta función:
     * - Insertaría la cita en la base de datos
     * - Generaría un ID único real
     * - Registraría timestamp de creación
     * - Bloquearía el horario para evitar dobles reservas
     * 
     * @param {string} userId - Identificador del usuario/cliente
     * @param {string} barberId - Identificador del barbero
     * @param {string} date - Fecha y hora de la cita
     * @returns {Object} Objeto con los datos de la cita creada
     * @returns {number} return.appointmentId - ID único de la cita
     * 
     * @example
     * const appointment = service.schedule("user456", "barber123", "2026-03-15 10:00");
     * // { appointmentId: 7845 }
     * 
     * // En producción:
     * // INSERT INTO appointments (user_id, barber_id, date, status)
     * // VALUES (?, ?, ?, 'confirmed')
     */
    schedule(userId, barberId, date) {
        console.log(`[Citas] ✅ Cita agendada para el usuario ${userId} con el barbero ${barberId}.`);
        
        // Simulación: Genera un ID aleatorio
        // En producción: const result = await db.appointments.create({userId, barberId, date});
        const appointmentId = Math.floor(Math.random() * 10000);
        
        return { 
            appointmentId,
            userId,
            barberId,
            date,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };
    }
}

/**
 * PaymentService - Servicio de Procesamiento de Pagos
 * 
 * Este servicio maneja todas las transacciones financieras del sistema.
 * 
 * En un sistema de producción, este servicio:
 * - Se integraría con gateways de pago (Stripe, PayPal, Conekta, etc.)
 * - Manejaría diferentes métodos de pago (tarjeta, efectivo, transferencia)
 * - Implementaría manejo de reembolsos
 * - Registraría transacciones para auditoría
 * - Implementaría medidas de seguridad PCI-DSS
 * 
 * Responsabilidades:
 * - Procesar pagos y cobros
 * - Validar información de pago
 * - Manejar transacciones seguras
 * - Generar comprobantes
 * 
 * @class PaymentService
 */
class PaymentService {
    /**
     * Procesa un cobro al cliente
     * 
     * En producción, esta función:
     * - Se conectaría a un gateway de pagos real
     * - Validaría datos de la tarjeta
     * - Procesaría la transacción de forma segura
     * - Generaría comprobante de pago
     * - Registraría la transacción en la base de datos
     * 
     * @param {string} userId - Identificador del usuario a cobrar
     * @param {number} amount - Monto a cobrar (en MXN)
     * @param {Object} paymentDetails - Detalles del método de pago
     * @param {string} paymentDetails.method - Método de pago ('tarjeta', 'efectivo', 'transferencia')
     * @param {string} [paymentDetails.cardNumber] - Número de tarjeta (últimos 4 dígitos)
     * @param {string} [paymentDetails.token] - Token de pago del gateway
     * @returns {boolean} true si el pago fue exitoso, false si fue rechazado
     * 
     * @example
     * const success = service.processCharge("user123", 250, {
     *   method: "tarjeta",
     *   cardNumber: "**** **** **** 1234"
     * });
     * 
     * // En producción:
     * // const charge = await stripe.charges.create({
     * //   amount: amount * 100,  // Stripe usa centavos
     * //   currency: 'mxn',
     * //   source: paymentDetails.token,
     * //   description: 'Corte de cabello - PrimeCorte'
     * // });
     */
    processCharge(userId, amount, paymentDetails) {
        console.log(`[Pagos] 💳 Procesando cobro de $${amount} MXN al usuario ${userId} usando ${paymentDetails.method}...`);
        
        // Simulación: El pago siempre es exitoso
        // En producción: const result = await paymentGateway.charge({...});
        
        // Log adicional para debugging
        if (paymentDetails.cardNumber) {
            console.log(`[Pagos] 💳 Tarjeta: ${paymentDetails.cardNumber}`);
        }
        
        // Simulación de procesamiento
        console.log(`[Pagos] ✅ Pago de $${amount} MXN procesado exitosamente`);
        
        return true; // En producción: return result.success;
    }
}

/**
 * NotificationService - Servicio de Envío de Notificaciones
 * 
 * Este servicio gestiona todas las comunicaciones con clientes y barberos.
 * 
 * En un sistema de producción, este servicio:
 * - Se integraría con proveedores de SMS (Twilio, Vonage, etc.)
 * - Se conectaría con servicios de push notifications (Firebase, OneSignal)
 * - Enviaría emails (SendGrid, AWS SES, etc.)
 * - Implementaría plantillas de mensajes
 * - Manejaría reintentos en caso de fallo
 * - Registraría logs de notificaciones enviadas
 * 
 * Responsabilidades:
 * - Enviar notificaciones SMS
 * - Enviar notificaciones push
 * - Gestionar plantillas de mensajes
 * - Manejar diferentes canales de comunicación
 * 
 * @class NotificationService
 */
class NotificationService {
    /**
     * Envía un mensaje SMS a un usuario/cliente
     * 
     * En producción, esta función:
     * - Se conectaría a un proveedor de SMS (Twilio, Nexmo, etc.)
     * - Validaría el número de teléfono
     * - Enviaría el SMS de forma asíncrona
     * - Registraría el envío en logs
     * - Manejaría errores de envío
     * 
     * @param {string} userId - Identificador del usuario destinatario
     * @param {string} message - Mensaje a enviar (máx. 160 caracteres para SMS)
     * @returns {void}
     * 
     * @example
     * service.sendSMS("user123", "Tu cita ha sido confirmada para mañana a las 10:00 AM");
     * 
     * // En producción:
     * // const user = await db.users.findById(userId);
     * // await twilioClient.messages.create({
     * //   body: message,
     * //   to: user.phone,
     * //   from: process.env.TWILIO_PHONE_NUMBER
     * // });
     */
    sendSMS(userId, message) {
        console.log(`[Notificación] 📱 SMS al usuario ${userId}: "${message}"`);
        
        // En producción:
        // const user = await db.users.findById(userId);
        // await smsProvider.send(user.phone, message);
    }

    /**
     * Envía una notificación push al barbero
     * 
     * En producción, esta función:
     * - Se conectaría a Firebase Cloud Messaging o similar
     * - Obtendría el device token del barbero
     * - Enviaría la notificación push
     * - Incluiría datos adicionales (deep linking, etc.)
     * - Manejaría notificaciones para iOS y Android
     * 
     * @param {string} barberId - Identificador del barbero destinatario
     * @param {string} message - Mensaje de la notificación
     * @returns {void}
     * 
     * @example
     * service.sendPushToBarber("barber456", "Tienes una nueva cita agendada");
     * 
     * // En producción:
     * // const barber = await db.barbers.findById(barberId);
     * // await admin.messaging().send({
     * //   token: barber.deviceToken,
     * //   notification: {
     * //     title: 'Nueva Cita',
     * //     body: message
     * //   },
     * //   data: { type: 'new_appointment', barberId }
     * // });
     */
    sendPushToBarber(barberId, message) {
        console.log(`[Notificación] 🔔 Push al barbero ${barberId}: "${message}"`);
        
        // En producción:
        // const barber = await db.barbers.findById(barberId);
        // await pushProvider.send(barber.deviceToken, {
        //   title: 'Nueva Cita',
        //   body: message
        // });
    }
}

// ============================================================================
// CAPA 2: LA FACHADA (FACADE) - El Orquestador
// ============================================================================
// Esta es la clase principal del patrón Facade. Proporciona una interfaz
// simple y unificada para interactuar con todos los subsistemas complejos.

/**
 * BookingFacade - Fachada del Sistema de Reservas
 * 
 * Esta es la implementación del patrón Facade. Proporciona una interfaz
 * simple para el proceso complejo de reservar un corte de cabello.
 * 
 * El patrón Facade:
 * - Oculta la complejidad de los subsistemas
 * - Proporciona una interfaz unificada y fácil de usar
 * - Orquesta múltiples servicios en el orden correcto
 * - Maneja la lógica de negocio del proceso de reserva
 * - Centraliza el manejo de errores
 * 
 * Ventajas:
 * - El cliente (controller) no necesita conocer los subsistemas
 * - Reduce el acoplamiento entre capas
 * - Facilita cambios en los subsistemas sin afectar clientes
 * - Simplifica el código del cliente
 * - Mejora la testabilidad
 * 
 * Proceso de reserva:
 * 1. Verificar disponibilidad del barbero
 * 2. Procesar el pago
 * 3. Agendar la cita
 * 4. Enviar notificaciones
 * 
 * @class BookingFacade
 */
class BookingFacade {
    /**
     * Constructor - Inicializa todos los subsistemas
     * 
     * La fachada mantiene referencias a todos los servicios que necesita
     * orquestar. Estos servicios son creados e inicializados aquí.
     * 
     * En un sistema más complejo, estos servicios podrían ser inyectados
     * como dependencias (Dependency Injection).
     */
    constructor() {
        // Inicializa los tres subsistemas principales
        this.appointment = new AppointmentService();
        this.payment = new PaymentService();
        this.notification = new NotificationService();
        
        console.log('✨ BookingFacade inicializada con todos los servicios');
    }

    /**
     * Reserva un corte de cabello - Método principal de la fachada
     * 
     * Este es el método público que los clientes usan para reservar.
     * Internamente, orquesta múltiples servicios en el orden correcto
     * y maneja toda la complejidad.
     * 
     * Flujo del proceso:
     * 1. ✅ Verificar disponibilidad del barbero
     * 2. 💳 Procesar pago ($250 MXN)
     * 3. 📅 Agendar la cita
     * 4. 📱 Enviar SMS al cliente
     * 5. 🔔 Enviar notificación push al barbero
     * 6. ✨ Retornar resultado
     * 
     * Manejo de errores:
     * - Si el barbero no está disponible → Error inmediato
     * - Si el pago es rechazado → Error antes de agendar
     * - Cualquier otro error → Capturado y retornado al cliente
     * 
     * @async
     * @param {string} userId - Identificador del cliente que reserva
     * @param {string} barberId - Identificador del barbero seleccionado
     * @param {string} date - Fecha y hora deseada (formato: "YYYY-MM-DD HH:mm")
     * @param {Object} paymentDetails - Información del método de pago
     * @param {string} paymentDetails.method - Tipo de pago ('tarjeta', 'efectivo', etc.)
     * @param {string} [paymentDetails.cardNumber] - Últimos 4 dígitos de la tarjeta
     * 
     * @returns {Promise<Object>} Resultado de la operación
     * @returns {boolean} return.success - true si la reserva fue exitosa
     * @returns {Object} [return.appointment] - Datos de la cita (si fue exitosa)
     * @returns {number} [return.appointment.appointmentId] - ID de la cita creada
     * @returns {string} [return.message] - Mensaje de error (si falló)
     * 
     * @example
     * // Caso exitoso
     * const result = await facade.bookHaircut(
     *   "user123",
     *   "barber456",
     *   "2026-03-15 10:00",
     *   { method: "tarjeta", cardNumber: "**** **** **** 1234" }
     * );
     * // { success: true, appointment: { appointmentId: 7845 } }
     * 
     * @example
     * // Caso de error
     * const result = await facade.bookHaircut(
     *   "user123",
     *   "barber_ocupado",
     *   "2026-03-15 10:00",
     *   { method: "tarjeta" }
     * );
     * // { success: false, message: "El barbero no está disponible en esa fecha." }
     */
    async bookHaircut(userId, barberId, date, paymentDetails) {
        try {
            console.log('\n╔════════════════════════════════════════════╗');
            console.log('║   INICIANDO PROCESO DE RESERVA            ║');
            console.log('╚════════════════════════════════════════════╝');
            console.log(`📝 Usuario: ${userId}`);
            console.log(`✂️  Barbero: ${barberId}`);
            console.log(`📅 Fecha: ${date}`);
            console.log('');
            
            // ================================================================
            // PASO 1: Verificar Disponibilidad
            // ================================================================
            console.log('🔍 PASO 1: Verificando disponibilidad...');
            
            const isAvailable = this.appointment.checkAvailability(barberId, date);
            
            if (!isAvailable) {
                throw new Error('El barbero no está disponible en esa fecha.');
            }
            
            console.log('✅ Barbero disponible');
            console.log('');

            // ================================================================
            // PASO 2: Procesar Pago
            // ================================================================
            console.log('💳 PASO 2: Procesando pago...');
            
            // Costo fijo del servicio: $250 MXN
            const serviceCost = 250;
            const paymentSuccess = this.payment.processCharge(userId, serviceCost, paymentDetails);
            
            if (!paymentSuccess) {
                throw new Error('El pago fue rechazado por el banco.');
            }
            
            console.log('✅ Pago procesado exitosamente');
            console.log('');

            // ================================================================
            // PASO 3: Agendar la Cita
            // ================================================================
            console.log('📅 PASO 3: Agendando cita...');
            
            const appointment = this.appointment.schedule(userId, barberId, date);
            
            console.log(`✅ Cita creada con ID: ${appointment.appointmentId}`);
            console.log('');

            // ================================================================
            // PASO 4: Enviar Notificaciones
            // ================================================================
            console.log('📱 PASO 4: Enviando notificaciones...');
            
            // Notificar al cliente por SMS
            this.notification.sendSMS(
                userId, 
                'Tu corte en PrimeCorte ha sido reservado con éxito. ¡Te esperamos!'
            );
            
            // Notificar al barbero por push
            this.notification.sendPushToBarber(
                barberId, 
                'Tienes un nuevo cliente agendado.'
            );
            
            console.log('✅ Notificaciones enviadas');
            console.log('');

            // ================================================================
            // ÉXITO: Proceso Completado
            // ================================================================
            console.log('╔════════════════════════════════════════════╗');
            console.log('║   ✨ RESERVA COMPLETADA EXITOSAMENTE ✨   ║');
            console.log('╚════════════════════════════════════════════╝\n');
            
            return { 
                success: true, 
                appointment: {
                    appointmentId: appointment.appointmentId,
                    userId,
                    barberId,
                    date,
                    amount: serviceCost,
                    status: 'confirmed'
                }
            };

        } catch (error) {
            // ================================================================
            // ERROR: Manejo de Excepciones
            // ================================================================
            console.error('\n╔════════════════════════════════════════════╗');
            console.error('║   ❌ ERROR EN LA RESERVA                  ║');
            console.error('╚════════════════════════════════════════════╝');
            console.error(`❌ ${error.message}\n`);
            
            // Retorna un objeto con información del error
            return { 
                success: false, 
                message: error.message 
            };
        }
    }
}

// ============================================================================
// CAPA 3: EL CLIENTE - API REST con Express
// ============================================================================
// Esta es la capa de presentación que usa la fachada. Gracias al patrón
// Facade, el código del controller es extremadamente simple y limpio.

/**
 * Configuración de la aplicación Express
 */
const app = express();

/**
 * Middleware para parsear JSON en el body de las peticiones
 * Permite recibir datos en formato JSON desde los clientes
 */
app.use(express.json());

/**
 * Instancia única de la fachada
 * 
 * Se crea una sola vez y se reutiliza para todas las peticiones.
 * Esto es eficiente y mantiene el estado de los servicios consistente.
 */
const bookingFacade = new BookingFacade();

// ============================================================================
// ENDPOINTS DE LA API
// ============================================================================

/**
 * Endpoint: Reservar un corte de cabello
 * 
 * Este endpoint demuestra la simplicidad que proporciona el patrón Facade.
 * El controller no necesita conocer los detalles de:
 * - Cómo verificar disponibilidad
 * - Cómo procesar pagos
 * - Cómo agendar citas
 * - Cómo enviar notificaciones
 * 
 * Todo eso está encapsulado en la fachada, haciendo que este código
 * sea simple, limpio y fácil de mantener.
 * 
 * Ruta: POST /api/reservar-corte
 * 
 * Body esperado:
 * {
 *   "userId": "string",        // Requerido - ID del cliente
 *   "barberId": "string",      // Requerido - ID del barbero
 *   "date": "string",          // Requerido - Formato: "YYYY-MM-DD HH:mm"
 *   "paymentDetails": {        // Requerido - Datos de pago
 *     "method": "string",      // Método: 'tarjeta', 'efectivo', etc.
 *     "cardNumber": "string"   // Opcional - Últimos 4 dígitos
 *   }
 * }
 * 
 * Respuestas:
 * - 200 OK: Reserva exitosa
 * - 400 Bad Request: Error en validación o en el proceso
 * 
 * @route POST /api/reservar-corte
 * @group Reservas - Operaciones de reserva de cortes
 * 
 * @param {Object} req.body - Datos de la reserva
 * @param {string} req.body.userId - ID del usuario/cliente
 * @param {string} req.body.barberId - ID del barbero
 * @param {string} req.body.date - Fecha y hora de la cita
 * @param {Object} req.body.paymentDetails - Detalles del pago
 * 
 * @returns {Object} 200 - Reserva exitosa
 * @returns {Object} 400 - Error en validación o proceso
 * 
 * @example
 * // Request exitoso
 * POST /api/reservar-corte
 * Content-Type: application/json
 * {
 *   "userId": "user123",
 *   "barberId": "barber456",
 *   "date": "2026-03-15 10:00",
 *   "paymentDetails": {
 *     "method": "tarjeta",
 *     "cardNumber": "**** **** **** 1234"
 *   }
 * }
 * 
 * // Response 200
 * {
 *   "message": "Reserva completada",
 *   "data": {
 *     "appointmentId": 7845,
 *     "userId": "user123",
 *     "barberId": "barber456",
 *     "date": "2026-03-15 10:00",
 *     "amount": 250,
 *     "status": "confirmed"
 *   }
 * }
 */
app.post('/api/reservar-corte', async (req, res) => {
    // ========================================================================
    // EXTRACCIÓN DE DATOS
    // ========================================================================
    const { userId, barberId, date, paymentDetails } = req.body;

    // ========================================================================
    // VALIDACIÓN DE DATOS OBLIGATORIOS
    // ========================================================================
    // Valida que los campos requeridos estén presentes
    if (!userId || !barberId || !date) {
        console.warn('⚠️  Validación fallida: Faltan datos obligatorios');
        
        return res.status(400).json({ 
            error: 'Faltan datos obligatorios para la reserva.',
            required: ['userId', 'barberId', 'date'],
            received: { userId: !!userId, barberId: !!barberId, date: !!date }
        });
    }

    // Log de la petición recibida
    console.log('\n📥 Nueva solicitud de reserva recibida:');
    console.log(`   Usuario: ${userId}`);
    console.log(`   Barbero: ${barberId}`);
    console.log(`   Fecha: ${date}`);

    // ========================================================================
    // LLAMADA A LA FACHADA - ¡Aquí está la magia del patrón!
    // ========================================================================
    // El controller solo necesita llamar a UN método de la fachada.
    // La fachada se encarga de toda la complejidad internamente.
    // Esto hace que el código sea:
    // - Limpio y fácil de leer
    // - Fácil de mantener
    // - Fácil de testear
    // - Desacoplado de los subsistemas
    
    const result = await bookingFacade.bookHaircut(userId, barberId, date, paymentDetails);

    // ========================================================================
    // MANEJO DE RESPUESTA
    // ========================================================================
    if (result.success) {
        // ✅ ÉXITO: La reserva se completó correctamente
        console.log('✅ Respuesta exitosa enviada al cliente\n');
        
        res.status(200).json({ 
            message: 'Reserva completada', 
            data: result.appointment 
        });
    } else {
        // ❌ ERROR: La reserva falló por alguna razón
        console.log(`❌ Respuesta de error enviada al cliente: ${result.message}\n`);
        
        res.status(400).json({ 
            message: 'No se pudo completar la reserva', 
            error: result.message 
        });
    }
});

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
 * de reserva en http://localhost:3000/api/reservar-corte
 */
app.listen(PORT, () => {
    console.log('╔════════════════════════════════════════════╗');
    console.log('║   Facade Pattern - Sistema de Reservas    ║');
    console.log('║          PrimeCorte Barbería               ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log('');
    console.log('📋 Endpoint disponible:');
    console.log(`   POST http://localhost:${PORT}/api/reservar-corte`);
    console.log('');
    console.log('✂️  Servicios integrados:');
    console.log('   • AppointmentService - Gestión de citas');
    console.log('   • PaymentService - Procesamiento de pagos');
    console.log('   • NotificationService - Envío de notificaciones');
    console.log('');
    console.log('💡 Patrón implementado: FACADE');
    console.log('   Una interfaz simple para múltiples subsistemas complejos');
    console.log('');
    console.log('✨ Presiona Ctrl+C para detener el servidor');
});

// Exporta la app para testing (opcional)
module.exports = app;