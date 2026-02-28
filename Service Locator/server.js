/**
 * @fileoverview Implementación del Patrón Service Locator
 * 
 * Este archivo demuestra el patrón Service Locator, que proporciona un registro
 * centralizado para servicios. Los servicios se registran al inicio y luego pueden
 * ser obtenidos por cualquier componente de la aplicación sin conocer sus
 * implementaciones concretas.
 * 
 * @description
 * Componentes principales:
 * - Service Locator: Registro centralizado de servicios
 * - Services: Implementaciones de lógica de negocio
 * - Client: API Express que consume los servicios
 * 
 * Ventajas:
 * - Desacoplamiento entre clientes y servicios
 * - Centralización del registro de servicios
 * - Fácil intercambio de implementaciones
 * - Reutilización de instancias
 * 
 * Desventajas:
 * - Oculta dependencias (anti-patrón según algunos)
 * - Acoplamiento global al locator
 * - Dificulta testing unitario
 * - Dependency Injection es preferida modernamente
 * 
 * @module ServiceLocatorPattern
 * @requires express - Framework web para Node.js
 * 
 * @author Sistema PrimeCorte
 * @version 1.0.0
 */

const express = require('express');

// ==========================================
// 1. SERVICIOS DE NEGOCIO (Business Logic Services)
// ==========================================

/**
 * @class BarberRatingService
 * @classdesc
 * Servicio que maneja la lógica de calificaciones de barberos.
 * Proporciona acceso a los barberos mejor calificados del sistema.
 * 
 * En producción, este servicio:
 * - Se conectaría a una base de datos real
 * - Implementaría filtros y ordenamiento avanzado
 * - Manejaría paginación
 * - Cachearía resultados
 * 
 * @example
 * const ratingService = new BarberRatingService();
 * const topBarbers = ratingService.getTopRatedBarbers();
 */
class BarberRatingService {
    /**
     * Obtiene la lista de barberos mejor calificados
     * 
     * @returns {Array<{id: number, name: string, rating: number, shop: string}>} 
     *          Array de barberos ordenados por calificación
     * 
     * @description
     * En la implementación actual, retorna datos simulados.
     * En producción, este método:
     * 1. Consultaría una base de datos
     * 2. Ordenaría por rating descendente
     * 3. Aplicaría filtros (activos, verificados, etc.)
     * 4. Limitaría resultados (ej: top 10)
     * 
     * @example
     * const topBarbers = ratingService.getTopRatedBarbers();
     * // [
     * //   { id: 1, name: 'Hugo', rating: 5.0, shop: 'Barbería Clásica' },
     * //   { id: 2, name: 'Carlos', rating: 4.8, shop: 'Estilo Urbano' }
     * // ]
     */
    getTopRatedBarbers() {
        console.log('[RatingService] Consultando la base de datos de barberos por estrellas...');
        
        // Datos simulados - En producción sería: return db.query('SELECT * FROM barbers...')
        return [
            { id: 1, name: 'Hugo', rating: 5.0, shop: 'Barbería Clásica' },
            { id: 2, name: 'Carlos', rating: 4.8, shop: 'Estilo Urbano' }
        ];
    }
}

/**
 * @class PremiumSubscriptionService
 * @classdesc
 * Servicio que maneja la verificación de suscripciones premium de usuarios.
 * Valida el estado de membresía y permisos asociados.
 * 
 * En producción, este servicio:
 * - Consultaría tabla de suscripciones en DB
 * - Verificaría fechas de expiración
 * - Validaría métodos de pago activos
 * - Registraría auditoría de accesos
 * 
 * @example
 * const subService = new PremiumSubscriptionService();
 * const isPremium = subService.verifyPremiumStatus('user123');
 */
class PremiumSubscriptionService {
    /**
     * Verifica si un usuario tiene suscripción premium activa
     * 
     * @param {string} userId - ID único del usuario a verificar
     * @returns {boolean} true si el usuario es premium, false en caso contrario
     * 
     * @description
     * En la implementación actual, siempre retorna true (simulación).
     * En producción, este método:
     * 1. Consultaría la tabla de suscripciones
     * 2. Verificaría fecha de expiración
     * 3. Validaría estado de pago
     * 4. Retornaría el estado real
     * 
     * Query de ejemplo en producción:
     * ```sql
     * SELECT EXISTS(
     *   SELECT 1 FROM subscriptions 
     *   WHERE user_id = ? 
     *   AND status = 'active' 
     *   AND expires_at > NOW()
     * )
     * ```
     * 
     * @example
     * const isPremium = subService.verifyPremiumStatus('user123');
     * if (isPremium) {
     *   // Permitir acceso a funcionalidades premium
     * }
     */
    verifyPremiumStatus(userId) {
        console.log(`[SubscriptionService] Verificando si el usuario ${userId} es Premium...`);
        
        // Simulación - En producción sería: return db.checkSubscription(userId)
        return true;
    }
}

// ==========================================
// 2. SERVICE LOCATOR (Patrón Central)
// ==========================================

/**
 * @class ServiceLocator
 * @classdesc
 * Implementación del patrón Service Locator.
 * 
 * Actúa como un registro centralizado donde los servicios son registrados
 * al inicio de la aplicación y desde donde pueden ser recuperados cuando
 * se necesiten. Funciona como un "directorio telefónico" de servicios.
 * 
 * Responsabilidades:
 * - Mantener un registro de servicios disponibles
 * - Proporcionar acceso a servicios por nombre
 * - Validar existencia de servicios solicitados
 * - Gestionar ciclo de vida de servicios (singleton en este caso)
 * 
 * Patrón relacionado: Singleton
 * Típicamente, el Service Locator mismo es un singleton.
 * 
 * @example
 * const locator = new ServiceLocator();
 * 
 * // Registrar servicios
 * locator.register('myService', new MyService());
 * 
 * // Obtener servicios
 * const service = locator.get('myService');
 * service.doSomething();
 */
class ServiceLocator {
    /**
     * Constructor del Service Locator
     * 
     * @constructor
     * @description
     * Inicializa el registro de servicios como un objeto vacío.
     * Los servicios deben ser registrados explícitamente antes de usarse.
     */
    constructor() {
        /**
         * Registro interno de servicios
         * 
         * @private
         * @type {Object.<string, Object>}
         * @description
         * Mapa que asocia nombres de servicios con sus instancias.
         * Estructura: { 'nombreServicio': instanciaDelServicio }
         */
        this.services = {};
    }

    /**
     * Registra un servicio en el locator
     * 
     * @param {string} name - Nombre único del servicio (identificador)
     * @param {Object} serviceInstance - Instancia del servicio a registrar
     * @returns {void}
     * 
     * @description
     * Almacena una instancia de servicio con un nombre identificador.
     * Si el nombre ya existe, sobrescribe el servicio anterior.
     * 
     * Patrón de uso:
     * 1. Crear instancia del servicio
     * 2. Registrarla con un nombre descriptivo
     * 3. Ese nombre será usado para recuperar el servicio
     * 
     * @example
     * const ratingService = new BarberRatingService();
     * locator.register('ratingService', ratingService);
     * 
     * // Ahora 'ratingService' está disponible globalmente
     * const service = locator.get('ratingService');
     */
    register(name, serviceInstance) {
        this.services[name] = serviceInstance;
        console.log(`[Locator] Servicio '${name}' registrado exitosamente.`);
    }

    /**
     * Obtiene un servicio del locator por su nombre
     * 
     * @param {string} name - Nombre del servicio a obtener
     * @returns {Object} Instancia del servicio solicitado
     * @throws {Error} Si el servicio no ha sido registrado
     * 
     * @description
     * Busca y retorna un servicio previamente registrado.
     * Este es el método principal de "lookup" del patrón.
     * 
     * Flujo:
     * 1. Verifica si el servicio existe en el registro
     * 2. Si existe, retorna la instancia
     * 3. Si no existe, lanza error
     * 
     * Ventaja: El cliente no necesita saber cómo instanciar el servicio
     * Desventaja: Oculta la dependencia (no es explícita)
     * 
     * @example
     * try {
     *   const service = locator.get('ratingService');
     *   service.getTopRatedBarbers();
     * } catch (error) {
     *   console.error('Servicio no disponible:', error.message);
     * }
     */
    get(name) {
        if (!this.services[name]) {
            throw new Error(`[Locator] El servicio '${name}' no ha sido registrado.`);
        }
        return this.services[name];
    }
}

/**
 * Instancia global del Service Locator (Singleton)
 * 
 * @type {ServiceLocator}
 * @global
 * @description
 * Instancia única del locator que será utilizada en toda la aplicación.
 * Este es el punto de acceso global a todos los servicios registrados.
 * 
 * Patrón Singleton: Solo hay una instancia del locator en toda la app.
 * 
 * En producción, esto podría ser:
 * - Exportado como módulo
 * - Inyectado en el contexto de Express
 * - Gestionado por un framework IoC
 */
const locator = new ServiceLocator();

// ==========================================
// 3. INICIALIZACIÓN Y REGISTRO DE SERVICIOS
// ==========================================

/**
 * Fase de bootstrapping: Registro de servicios
 * 
 * @description
 * Esta es la fase de configuración donde todos los servicios son instanciados
 * y registrados en el Service Locator.
 * 
 * Ventaja del patrón:
 * Si necesitamos cambiar la implementación de un servicio, solo modificamos esta
 * sección. El resto del código (API, lógica de negocio) no necesita cambios.
 * 
 * Ejemplo de intercambio:
 * ```javascript
 * // Antes:
 * locator.register('ratingService', new BarberRatingService());
 * 
 * // Después (nueva versión):
 * locator.register('ratingService', new BarberRatingServiceV2());
 * 
 * // El resto del código sigue funcionando sin cambios
 * ```
 */

// Registrar servicio de calificaciones
locator.register('ratingService', new BarberRatingService());

// Registrar servicio de suscripciones
locator.register('subscriptionService', new PremiumSubscriptionService());

// ==========================================
// 4. CLIENTE - EXPRESS API
// ==========================================

/**
 * Aplicación Express - Cliente del Service Locator
 * 
 * @type {express.Application}
 * @description
 * El API actúa como cliente del Service Locator.
 * En lugar de instanciar servicios directamente, los obtiene del locator.
 */
const app = express();

/**
 * @api {get} /api/mejores-barberos Obtener barberos mejor calificados
 * @apiName GetTopBarbers
 * @apiGroup Barbers
 * 
 * @apiDescription
 * Endpoint que demuestra el uso del Service Locator.
 * Obtiene servicios del locator y los utiliza para procesar la petición.
 * 
 * Flujo con Service Locator:
 * 1. Cliente hace petición HTTP
 * 2. Handler solicita servicios al locator (lookup)
 * 3. Locator retorna instancias de servicios
 * 4. Handler usa los servicios
 * 5. Handler retorna respuesta al cliente
 * 
 * Ventajas:
 * - No necesita conocer implementaciones concretas
 * - No instancia servicios directamente
 * - Fácil de cambiar implementaciones
 * 
 * Desventajas:
 * - Dependencias ocultas (no explícitas en la firma)
 * - Difícil de testear sin setup del locator
 * 
 * @apiParam {String} [userId=invitado] ID del usuario (query parameter)
 * 
 * @apiSuccess {String} message Mensaje de éxito
 * @apiSuccess {Boolean} premiumUser Indica si el usuario es premium
 * @apiSuccess {Array} data Array de barberos mejor calificados
 * @apiSuccess {Number} data.id ID del barbero
 * @apiSuccess {String} data.name Nombre del barbero
 * @apiSuccess {Number} data.rating Calificación (0-5)
 * @apiSuccess {String} data.shop Nombre de la barbería
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Mejores barberos encontrados",
 *       "premiumUser": true,
 *       "data": [
 *         {
 *           "id": 1,
 *           "name": "Hugo",
 *           "rating": 5.0,
 *           "shop": "Barbería Clásica"
 *         },
 *         {
 *           "id": 2,
 *           "name": "Carlos",
 *           "rating": 4.8,
 *           "shop": "Estilo Urbano"
 *         }
 *       ]
 *     }
 * 
 * @apiError (500) {String} error Mensaje de error cuando falla el locator
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "El servicio 'ratingService' no ha sido registrado."
 *     }
 */
app.get('/api/mejores-barberos', (req, res) => {
    // Extraer userId del query string, defaultear a 'invitado'
    const userId = req.query.userId || 'invitado';

    try {
        // ============================================
        // USO DEL SERVICE LOCATOR (Lookup de servicios)
        // ============================================
        
        // En lugar de: const ratingService = new BarberRatingService();
        // Usamos el locator para obtener el servicio
        const ratingService = locator.get('ratingService');
        const subService = locator.get('subscriptionService');

        // ============================================
        // USO DE LOS SERVICIOS OBTENIDOS
        // ============================================
        
        // Verificar si el usuario es premium
        const isPremium = subService.verifyPremiumStatus(userId);
        
        // Obtener barberos mejor calificados
        const topBarbers = ratingService.getTopRatedBarbers();

        // ============================================
        // RESPUESTA AL CLIENTE
        // ============================================
        res.status(200).json({
            message: 'Mejores barberos encontrados',
            premiumUser: isPremium,
            data: topBarbers
        });

    } catch (error) {
        // ============================================
        // MANEJO DE ERRORES
        // ============================================
        // Si un servicio no está registrado, el locator lanza error
        // Capturamos y retornamos error 500
        
        console.error('[API] Error al procesar petición:', error.message);
        
        res.status(500).json({ 
            error: error.message 
        });
    }
});

/**
 * Puerto del servidor
 * @constant {number}
 */
const PORT = 3000;

/**
 * Iniciar servidor Express
 * 
 * @description
 * El servidor escucha en el puerto 3000.
 * Todos los servicios ya están registrados en el locator
 * y listos para ser utilizados por los endpoints.
 */
app.listen(PORT, () => {
    console.log('╔══════════════════════════════════════════╗');
    console.log('║   Service Locator Pattern - PrimeCorte  ║');
    console.log('║   Puerto: 3000                          ║');
    console.log('║   Estado: ✅ Activo                      ║');
    console.log('╚══════════════════════════════════════════╝');
    console.log('');
    console.log('📋 Servicios registrados:');
    console.log('   ✅ ratingService (BarberRatingService)');
    console.log('   ✅ subscriptionService (PremiumSubscriptionService)');
    console.log('');
    console.log('🌐 Endpoints disponibles:');
    console.log(`   GET  http://localhost:${PORT}/api/mejores-barberos`);
    console.log('');
});