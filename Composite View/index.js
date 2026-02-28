/**
 * @fileoverview Servidor principal - Composite View Pattern
 * 
 * Este servidor Express demuestra el uso del patrón Composite View
 * para construir páginas web completas a partir de componentes reutilizables.
 * 
 * El patrón Composite View permite:
 * - Construir páginas complejas desde componentes simples
 * - Reutilizar componentes en diferentes páginas
 * - Mantener una estructura consistente
 * - Facilitar el mantenimiento y la escalabilidad
 * 
 * @author Temas Selectos de Programación
 * @version 1.0.0
 */

const express = require('express');
const ViewComposer = require('./viewComposer');

// Inicializa la aplicación Express
const app = express();

// Crea una instancia del ViewComposer
const composer = new ViewComposer();

/**
 * Ruta: Página de Inicio (Home)
 * 
 * Demuestra una página completa con todos los componentes:
 * header, content, sidebar y footer.
 * 
 * @route GET /
 */
app.get('/', (req, res) => {
  // Define los datos para cada componente de la página
  const pageData = {
    pageTitle: 'Inicio - Composite View Pattern',
    
    // Datos para el componente Header
    header: {
      title: 'Patrón Composite View',
      user: 'Josué'
    },
    
    // Datos para el componente Content principal
    content: {
      title: 'Bienvenido al Patrón Composite View',
      body: `
        <p>El patrón <strong>Composite View</strong> es un patrón de diseño empresarial 
        que permite construir vistas complejas a partir de vistas más simples y atómicas.</p>
        
        <p>Esta página está compuesta por múltiples componentes reutilizables:</p>
        <ul>
          <li><strong>Header:</strong> Encabezado con navegación</li>
          <li><strong>Content:</strong> Área de contenido principal</li>
          <li><strong>Sidebar:</strong> Barra lateral con widgets</li>
          <li><strong>Footer:</strong> Pie de página con información</li>
        </ul>
        
        <p>Cada componente es independiente y puede ser reutilizado en diferentes páginas.</p>
      `,
      // Lista de items para mostrar como tarjetas
      items: [
        {
          title: 'Reutilización',
          description: 'Los componentes pueden ser usados en múltiples páginas',
          link: '#'
        },
        {
          title: 'Mantenibilidad',
          description: 'Cambios en un componente se reflejan en todas las páginas',
          link: '#'
        },
        {
          title: 'Flexibilidad',
          description: 'Fácil crear diferentes layouts combinando componentes',
          link: '#'
        }
      ]
    },
    
    // Datos para el componente Sidebar
    sidebar: {
      categories: ['Patrones de Diseño', 'JavaScript', 'Node.js', 'Express'],
      recentPosts: [
        { title: 'Introducción a Composite View', link: '/' },
        { title: 'Patrones Empresariales', link: '/about' },
        { title: 'Arquitectura de Software', link: '/contact' }
      ]
    },
    
    // Datos para el componente Footer
    footer: {
      company: 'Temas Selectos de Programación',
      year: 2026
    }
  };

  // Compone la página completa usando ViewComposer
  const html = composer.composePage(pageData);
  
  // Envía el HTML composito al cliente
  res.send(html);
});

/**
 * Ruta: Página Acerca de (About)
 * 
 * Demuestra una página con diferentes datos pero la misma estructura.
 * Reutiliza los mismos componentes con diferente contenido.
 * 
 * @route GET /about
 */
app.get('/about', (req, res) => {
  const pageData = {
    pageTitle: 'Acerca de - Composite View',
    
    header: {
      title: 'Patrón Composite View',
      user: 'Josué'
    },
    
    content: {
      title: 'Acerca del Patrón Composite View',
      body: `
        <h3>¿Qué es Composite View?</h3>
        <p>Composite View es un patrón de diseño que se utiliza en aplicaciones web
        para construir vistas complejas a partir de componentes más simples.</p>
        
        <h3>Ventajas</h3>
        <ul>
          <li>Reutilización de código</li>
          <li>Mantenimiento simplificado</li>
          <li>Consistencia visual</li>
          <li>Separación de responsabilidades</li>
          <li>Facilita el testing unitario</li>
        </ul>
        
        <h3>Casos de Uso</h3>
        <p>Este patrón es ideal para:</p>
        <ul>
          <li>Aplicaciones con múltiples páginas que comparten componentes</li>
          <li>Sistemas que requieren mantener consistencia visual</li>
          <li>Proyectos donde los componentes de UI necesitan ser reutilizables</li>
        </ul>
      `,
      items: []
    },
    
    sidebar: {
      categories: ['Documentación', 'Ejemplos', 'Tutoriales'],
      recentPosts: [
        { title: 'Implementación en Node.js', link: '/' },
        { title: 'Ejemplos Prácticos', link: '/about' }
      ]
    },
    
    footer: {
      company: 'Temas Selectos de Programación',
      year: 2026
    }
  };

  const html = composer.composePage(pageData);
  res.send(html);
});

/**
 * Ruta: Página de Contacto (Contact)
 * 
 * Demuestra una página simple sin sidebar usando composeSimplePage.
 * Muestra la flexibilidad del patrón para diferentes layouts.
 * 
 * @route GET /contact
 */
app.get('/contact', (req, res) => {
  const pageData = {
    pageTitle: 'Contacto - Composite View',
    
    header: {
      title: 'Patrón Composite View',
      user: 'Josué'
    },
    
    content: {
      title: 'Contáctanos',
      body: `
        <div style="max-width: 600px; margin: 0 auto;">
          <p>Esta página usa un layout simple sin sidebar, demostrando
          la flexibilidad del patrón Composite View.</p>
          
          <form style="display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem;">
            <div>
              <label style="display: block; margin-bottom: 0.5rem;">Nombre:</label>
              <input type="text" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            
            <div>
              <label style="display: block; margin-bottom: 0.5rem;">Email:</label>
              <input type="email" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            
            <div>
              <label style="display: block; margin-bottom: 0.5rem;">Mensaje:</label>
              <textarea rows="5" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;"></textarea>
            </div>
            
            <button type="submit" style="padding: 0.75rem; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Enviar Mensaje
            </button>
          </form>
        </div>
      `,
      items: []
    },
    
    footer: {
      company: 'Temas Selectos de Programación',
      year: 2026
    }
  };

  // Usa composeSimplePage para un layout sin sidebar
  const html = composer.composeSimplePage(pageData);
  res.send(html);
});

/**
 * Ruta: API para obtener un componente individual
 * 
 * Demuestra cómo renderizar componentes individuales.
 * Útil para aplicaciones AJAX o SPAs.
 * 
 * @route GET /api/component/:name
 */
app.get('/api/component/:name', (req, res) => {
  const componentName = req.params.name;
  
  try {
    // Datos de ejemplo para el componente
    const sampleData = {
      header: { title: 'API Example', user: 'API User' },
      footer: { company: 'API Company', year: 2026 },
      sidebar: {},
      content: { title: 'API Content', body: '<p>From API</p>' }
    };

    // Renderiza solo el componente solicitado
    const html = composer.renderComponent(componentName, sampleData[componentName] || {});
    
    res.send(html);
  } catch (error) {
    res.status(404).json({
      error: error.message
    });
  }
});

/**
 * Ruta 404 - Página no encontrada
 * 
 * Maneja rutas no definidas mostrando una página de error
 * usando el mismo patrón Composite View.
 */
app.use((req, res) => {
  const pageData = {
    pageTitle: '404 - Página No Encontrada',
    
    header: {
      title: 'Patrón Composite View',
      user: 'Josué'
    },
    
    content: {
      title: '404 - Página No Encontrada',
      body: `
        <p>Lo sentimos, la página que buscas no existe.</p>
        <p><a href="/" style="color: #667eea;">Volver al inicio</a></p>
      `,
      items: []
    },
    
    footer: {
      company: 'Temas Selectos de Programación',
      year: 2026
    }
  };

  const html = composer.composeSimplePage(pageData);
  res.status(404).send(html);
});

// Inicia el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log('========================================');
  console.log('   Composite View Pattern - Running    ');
  console.log('========================================');
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
  console.log('');
  console.log('Available routes:');
  console.log('  - GET /         (Home page)');
  console.log('  - GET /about    (About page)');
  console.log('  - GET /contact  (Contact page - simple layout)');
  console.log('  - GET /api/component/:name (Individual component)');
  console.log('========================================');
});
