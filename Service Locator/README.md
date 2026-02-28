# 🔍 Service Locator Pattern

## 📋 Descripción

Implementación del **Patrón Service Locator** utilizando Node.js y Express. Este patrón proporciona un registro centralizado para servicios, permitiendo que los componentes de la aplicación obtengan referencias a servicios sin conocer sus implementaciones concretas.

### ¿Qué es el Patrón Service Locator?

Es un patrón de diseño que actúa como un registro centralizado donde los servicios son registrados y desde donde pueden ser recuperados. Funciona como un "directorio de servicios" o "conserje" que sabe dónde encontrar cada servicio cuando se necesita.

**Componentes principales:**
- ✅ **Service Locator**: Registro centralizado que mantiene referencias a servicios
- ✅ **Services**: Implementaciones concretas de funcionalidades
- ✅ **Client**: Componentes que necesitan usar los servicios

## 🎯 Ventajas

- **Desacoplamiento**: Los clientes no necesitan conocer las implementaciones concretas
- **Centralización**: Único punto de registro y acceso a servicios
- **Flexibilidad**: Fácil intercambio de implementaciones de servicios
- **Reutilización**: Los servicios se instancian una sola vez y se reutilizan
- **Testabilidad**: Fácil sustitución de servicios reales por mocks

## 🎨 Desventajas

- **Acoplamiento al Locator**: Dependencia del Service Locator en toda la aplicación
- **Anti-patrón**: Considerado por algunos como anti-patrón (oculta dependencias)
- **Dificulta testing**: No es evidente qué servicios necesita un componente
- **Alternativa moderna**: Dependency Injection es preferida actualmente

## 🏛️ Arquitectura del Sistema

### Diagrama de Arquitectura

```mermaid
graph TB
    Client[Client / API Endpoint]
    SL[Service Locator<br/>Registry]
    
    subgraph "Servicios Registrados"
        RS[BarberRatingService]
        SS[PremiumSubscriptionService]
    end
    
    Client -->|1. get('ratingService')| SL
    Client -->|2. get('subscriptionService')| SL
    SL -->|3. Retorna instancia| RS
    SL -->|4. Retorna instancia| SS
    
    style SL fill:#e1f5ff
    style Client fill:#f3e5f5
    style RS fill:#fff4e1
    style SS fill:#e8f5e9
```

## 📊 Diagramas UML

### 1. Diagrama de Clases

```mermaid
classDiagram
    class ServiceLocator {
        -Map~String, Object~ services
        +register(name: String, instance: Object)
        +get(name: String): Object
    }
    
    class BarberRatingService {
        +getTopRatedBarbers(): Array~Barber~
    }
    
    class PremiumSubscriptionService {
        +verifyPremiumStatus(userId: String): Boolean
    }
    
    class ExpressApp {
        +GET /api/mejores-barberos
        -handleBestBarbers(req, res)
    }
    
    class Barber {
        +Number id
        +String name
        +Number rating
        +String shop
    }
    
    ServiceLocator "1" --> "*" BarberRatingService : manages
    ServiceLocator "1" --> "*" PremiumSubscriptionService : manages
    ExpressApp ..> ServiceLocator : uses
    ExpressApp ..> BarberRatingService : obtains from locator
    ExpressApp ..> PremiumSubscriptionService : obtains from locator
    BarberRatingService --> Barber : returns
```

### 2. Diagrama de Secuencia - Registro de Servicios

```mermaid
sequenceDiagram
    participant Main as Aplicación Principal
    participant Locator as Service Locator
    participant RS as BarberRatingService
    participant SS as SubscriptionService
    
    Note over Main: Inicio de la aplicación
    
    Main->>RS: new BarberRatingService()
    activate RS
    RS-->>Main: instancia
    deactivate RS
    
    Main->>Locator: register('ratingService', instancia)
    activate Locator
    Locator->>Locator: services['ratingService'] = instancia
    Locator-->>Main: OK
    deactivate Locator
    
    Main->>SS: new PremiumSubscriptionService()
    activate SS
    SS-->>Main: instancia
    deactivate SS
    
    Main->>Locator: register('subscriptionService', instancia)
    activate Locator
    Locator->>Locator: services['subscriptionService'] = instancia
    Locator-->>Main: OK
    deactivate Locator
    
    Note over Main,Locator: Servicios registrados y listos
```

### 3. Diagrama de Secuencia - Obtención y Uso de Servicios

```mermaid
sequenceDiagram
    participant Client as Cliente HTTP
    participant API as Express API
    participant Locator as Service Locator
    participant RS as RatingService
    participant SS as SubscriptionService
    
    Client->>API: GET /api/mejores-barberos?userId=123
    activate API
    
    API->>Locator: get('ratingService')
    activate Locator
    Locator-->>API: BarberRatingService instance
    deactivate Locator
    
    API->>Locator: get('subscriptionService')
    activate Locator
    Locator-->>API: SubscriptionService instance
    deactivate Locator
    
    API->>SS: verifyPremiumStatus(123)
    activate SS
    SS-->>API: true
    deactivate SS
    
    API->>RS: getTopRatedBarbers()
    activate RS
    RS-->>API: Array[Barber]
    deactivate RS
    
    API-->>Client: 200 OK + JSON Response
    deactivate API
```

### 4. Diagrama de Secuencia - Error: Servicio No Registrado

```mermaid
sequenceDiagram
    participant Client as Cliente HTTP
    participant API as Express API
    participant Locator as Service Locator
    
    Client->>API: GET /api/endpoint
    activate API
    
    API->>Locator: get('nonExistentService')
    activate Locator
    
    Locator->>Locator: Verificar si existe
    Note over Locator: services['nonExistentService']<br/>= undefined
    
    Locator-->>API: throw Error("Servicio no registrado")
    deactivate Locator
    
    API-->>Client: 500 Internal Server Error
    deactivate API
```

### 5. Diagrama de Componentes

```mermaid
graph TB
    subgraph "Express Application"
        API[API Endpoints<br/>Express Routes]
    end
    
    subgraph "Service Locator Layer"
        SL[Service Locator<br/>Registry]
    end
    
    subgraph "Business Logic Services"
        RS[BarberRatingService<br/>Rating Logic]
        SS[PremiumSubscriptionService<br/>Subscription Logic]
    end
    
    subgraph "Data Layer"
        DB[(Database<br/>Simulated)]
    end
    
    API --> SL
    SL --> RS
    SL --> SS
    RS -.-> DB
    SS -.-> DB
    
    style SL fill:#e1f5ff
    style API fill:#f3e5f5
    style RS fill:#fff4e1
    style SS fill:#e8f5e9
    style DB fill:#ffebee
```

### 6. Diagrama de Flujo - Obtención de Servicio

```mermaid
flowchart TD
    Start([Cliente solicita servicio]) --> Request[API recibe petición]
    Request --> GetService[Solicitar servicio<br/>al Locator]
    GetService --> Check{¿Servicio<br/>registrado?}
    
    Check -->|Sí| Return[Retornar instancia<br/>del servicio]
    Check -->|No| Error[Lanzar error:<br/>Servicio no registrado]
    
    Return --> UseService[Usar el servicio<br/>para lógica de negocio]
    UseService --> Response[Retornar respuesta<br/>al cliente]
    Response --> End([Fin])
    
    Error --> ErrorResponse[Retornar error 500<br/>al cliente]
    ErrorResponse --> End
    
    style Start fill:#e8f5e9
    style End fill:#e8f5e9
    style Error fill:#ffebee
    style ErrorResponse fill:#ffebee
    style Check fill:#fff3e0
    style GetService fill:#e1f5ff
```

### 7. Diagrama de Estados del Service Locator

```mermaid
stateDiagram-v2
    [*] --> Inicializado: new ServiceLocator()
    
    Inicializado --> Registrando: register(name, service)
    Registrando --> ConServicios: Servicio agregado
    
    ConServicios --> Registrando: register() más servicios
    ConServicios --> Sirviendo: get(name)
    
    Sirviendo --> ConServicios: Servicio retornado
    Sirviendo --> Error: Servicio no encontrado
    
    Error --> ConServicios: Error manejado
    
    note right of Inicializado
        Estado inicial
        services = {}
    end note
    
    note right of ConServicios
        Servicios disponibles
        Listo para servir
    end note
```

## 🔧 Componentes del Sistema

### 1. Service Locator

Registro centralizado que mantiene un mapa de servicios registrados.

**Métodos:**
- `register(name, instance)` - Registra un servicio con un nombre
- `get(name)` - Obtiene una instancia de servicio por nombre

### 2. BarberRatingService

Servicio que proporciona información sobre barberos mejor calificados.

**Métodos:**
- `getTopRatedBarbers()` - Retorna array de barberos top

**Modelo de Datos:**
```javascript
{
  id: number,
  name: string,
  rating: number,
  shop: string
}
```

### 3. PremiumSubscriptionService

Servicio que verifica el estado de suscripción premium de usuarios.

**Métodos:**
- `verifyPremiumStatus(userId)` - Verifica si un usuario es premium

### 4. Express API

Endpoint REST que utiliza el Service Locator para obtener servicios.

**Endpoints:**
- `GET /api/mejores-barberos?userId={id}` - Obtiene barberos top

## 📦 Requisitos Previos

- **Node.js**: v14.0.0 o superior
- **npm**: v6.0.0 o superior

## 🔧 Instalación

```bash
# Clonar o navegar al directorio
cd "Service Locator"

# Instalar dependencias
npm install
```

## ▶️ Ejecución

```bash
# Iniciar el servidor
npm start

# O directamente con Node
node server.js
```

El servidor estará disponible en `http://localhost:3000`

## 📝 Uso Básico

### Obtener Mejores Barberos

```bash
curl http://localhost:3000/api/mejores-barberos?userId=123
```

**Respuesta:**
```json
{
  "message": "Mejores barberos encontrados",
  "premiumUser": true,
  "data": [
    {
      "id": 1,
      "name": "Hugo",
      "rating": 5.0,
      "shop": "Barbería Clásica"
    },
    {
      "id": 2,
      "name": "Carlos",
      "rating": 4.8,
      "shop": "Estilo Urbano"
    }
  ]
}
```

## 🏗️ Estructura del Proyecto

```
Service Locator/
├── server.js          # Implementación completa del patrón
├── package.json       # Dependencias del proyecto
├── README.md          # Documentación con UML
└── .gitignore        # Archivos a ignorar en git
```

## 🛠️ Tecnologías

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| Node.js | v14+ | Runtime de JavaScript |
| Express | ^5.2.1 | Framework web |

## 🎓 Conceptos Demostrados

1. **Service Locator Pattern**: Registro centralizado de servicios
2. **Singleton Pattern**: El locator es una instancia única global
3. **Dependency Lookup**: Búsqueda activa de dependencias
4. **Service Registry**: Registro de servicios disponibles
5. **Loose Coupling**: Desacoplamiento entre clientes y servicios

## 🔄 Flujo de Ejecución

1. **Inicialización**: Se crea instancia global de ServiceLocator
2. **Registro**: Los servicios se registran en el locator al iniciar
3. **Solicitud**: Cliente hace petición HTTP al API
4. **Lookup**: API solicita servicios al locator
5. **Uso**: API utiliza los servicios obtenidos
6. **Respuesta**: Se retorna resultado al cliente

## ⚖️ Service Locator vs Dependency Injection

| Aspecto | Service Locator | Dependency Injection |
|---------|----------------|----------------------|
| Obtención de deps | Activa (pull) | Pasiva (push) |
| Claridad | Oculta dependencias | Dependencias explícitas |
| Acoplamiento | Al locator | A interfaces |
| Testing | Más difícil | Más fácil |
| Modernidad | Patrón antiguo | Patrón preferido |

## 🚨 Consideraciones

### Ventajas Prácticas
- Implementación simple y directa
- No requiere frameworks adicionales
- Útil en aplicaciones pequeñas o prototipos
- Rápido de configurar

### Desventajas en Producción
- Oculta las dependencias reales de los componentes
- Dificulta el análisis estático del código
- Complica el testing unitario
- Crea acoplamiento global al locator
- Dependency Injection es generalmente preferida

## 💡 Alternativas Modernas

En lugar de Service Locator, considera usar:

- **Dependency Injection (DI)**: Inversify, TypeDI, Awilix
- **IoC Containers**: NestJS, Angular
- **Factory Pattern**: Para instanciación dinámica
- **Constructor Injection**: Para dependencias explícitas

## 📖 Recursos Adicionales

- [Service Locator Pattern - Martin Fowler](https://martinfowler.com/articles/injection.html#UsingAServiceLocator)
- [Design Patterns - Gang of Four](https://www.oreilly.com/library/view/design-patterns-elements/0201633612/)
- [Express.js Documentation](https://expressjs.com/)

## 📄 Licencia

ISC License

## ✨ Contexto

Este proyecto implementa el patrón Service Locator para un sistema de barbería (PrimeCorte), donde:
- Se gestionan calificaciones de barberos
- Se verifica el estado premium de usuarios
- Se centraliza el acceso a servicios de negocio

---

**⚠️ Nota:** Este patrón es útil para demostración y aprendizaje. Para aplicaciones en producción, considera usar **Dependency Injection** como alternativa más robusta y mantenible.
