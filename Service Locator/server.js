const express = require('express');

// ==========================================
// 1. LOS SERVICIOS (Las herramientas)
// ==========================================

class BarberRatingService {
    getTopRatedBarbers() {
        console.log('[RatingService] Consultando la base de datos de barberos por estrellas...');
        return [
            { id: 1, name: 'Hugo', rating: 5.0, shop: 'Barbería Clásica' },
            { id: 2, name: 'Carlos', rating: 4.8, shop: 'Estilo Urbano' }
        ];
    }
}

class PremiumSubscriptionService {
    verifyPremiumStatus(userId) {
        console.log(`[SubscriptionService] Verificando si el usuario ${userId} es Premium...`);
        return true; // Simulamos que es premium
    }
}

// ==========================================
// 2. EL SERVICE LOCATOR (El "Conserje")
// ==========================================

class ServiceLocator {
    constructor() {
        this.services = {}; // Aquí guardaremos nuestro "directorio"
    }

    // Método para registrar un servicio en el directorio
    register(name, serviceInstance) {
        this.services[name] = serviceInstance;
        console.log(`[Locator] Servicio '${name}' registrado exitosamente.`);
    }

    // Método para pedir un servicio
    get(name) {
        if (!this.services[name]) {
            throw new Error(`[Locator] El servicio '${name}' no ha sido registrado.`);
        }
        return this.services[name];
    }
}

// Creamos una única instancia global de nuestro Localizador
const locator = new ServiceLocator();

// ==========================================
// 3. INICIALIZACIÓN (Configurando el hotel)
// ==========================================

// Al arrancar la app, "registramos" qué servicios vamos a usar.
// La gran ventaja: si mañana cambiamos a un "BarberRatingServiceV2", 
// solo cambiamos esta línea y el resto de la app ni se entera.
locator.register('ratingService', new BarberRatingService());
locator.register('subscriptionService', new PremiumSubscriptionService());


// ==========================================
// 4. EL CLIENTE (Tu API con Express)
// ==========================================

const app = express();

app.get('/api/mejores-barberos', (req, res) => {
    const userId = req.query.userId || 'invitado';

    try {
        // En lugar de hacer "new BarberRatingService()", se lo pedimos al Localizador
        const ratingService = locator.get('ratingService');
        const subService = locator.get('subscriptionService');

        // Usamos los servicios que nos dio el localizador
        const isPremium = subService.verifyPremiumStatus(userId);
        const topBarbers = ratingService.getTopRatedBarbers();

        res.status(200).json({
            message: 'Mejores barberos encontrados',
            premiumUser: isPremium,
            data: topBarbers
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor de PrimeCorte corriendo en http://localhost:${PORT}`);
});