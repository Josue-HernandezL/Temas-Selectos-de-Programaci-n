/**
 * @fileoverview View Composer - Compositor de Vistas
 * 
 * Este es el componente central del patrón Composite View.
 * Se encarga de componer múltiples vistas individuales (header, content,
 * sidebar, footer) en una vista completa y cohesiva.
 * 
 * El patrón Composite View permite:
 * - Reutilización de componentes de vista
 * - Composición flexible de layouts
 * - Separación de responsabilidades
 * - Mantenimiento simplificado
 * 
 * @author Temas Selectos de Programación
 * @version 1.0.0
 */

// Importa todos los componentes de vista
const headerView = require('./views/header');
const footerView = require('./views/footer');
const sidebarView = require('./views/sidebar');
const contentView = require('./views/content');
const layoutView = require('./views/layout');

/**
 * Clase ViewComposer
 * 
 * Responsable de componer diferentes vistas en una página completa.
 * Implementa el patrón Composite View permitiendo construir
 * interfaces complejas a partir de componentes simples y reutilizables.
 */
class ViewComposer {
  /**
   * Crea una instancia del ViewComposer
   * 
   * @constructor
   */
  constructor() {
    /** @private */
    this.components = {
      header: headerView,
      footer: footerView,
      sidebar: sidebarView,
      content: contentView,
      layout: layoutView
    };
  }

  /**
   * Compone una página completa con todos los componentes
   * 
   * Este método es el núcleo del patrón Composite View.
   * Toma datos para cada componente y los ensambla en una vista completa.
   * 
   * @param {Object} pageData - Datos para componer la página
   * @param {string} pageData.pageTitle - Título de la página para el <title>
   * @param {Object} [pageData.header] - Datos para el componente header
   * @param {Object} pageData.content - Datos para el componente de contenido
   * @param {Object} [pageData.sidebar] - Datos para el componente sidebar
   * @param {Object} [pageData.footer] - Datos para el componente footer
   * 
   * @returns {string} HTML completo de la página compuesta
   * 
   * @example
   * const composer = new ViewComposer();
   * const html = composer.composePage({
   *   pageTitle: 'Mi Blog',
   *   header: { title: 'Blog Personal', user: 'Juan' },
   *   content: { title: 'Bienvenido', body: '<p>Contenido</p>' },
   *   sidebar: { categories: ['Tech', 'News'] },
   *   footer: { company: 'Mi Empresa', year: 2026 }
   * });
   */
  composePage(pageData) {
    // 1. Genera el componente Header
    const headerHTML = this.components.header(pageData.header || {});

    // 2. Genera el componente Content (principal)
    const contentHTML = this.components.content(pageData.content || {});

    // 3. Genera el componente Sidebar
    const sidebarHTML = this.components.sidebar(pageData.sidebar || {});

    // 4. Genera el componente Footer
    const footerHTML = this.components.footer(pageData.footer || {});

    // 5. Compone todos los componentes en la estructura principal
    const bodyContent = `
      ${headerHTML}
      <div class="container">
        <div class="main-wrapper">
          ${contentHTML}
          ${sidebarHTML}
        </div>
      </div>
      ${footerHTML}
    `;

    // 6. Envuelve todo en el layout base (estructura HTML completa)
    const fullPage = this.components.layout({
      title: pageData.pageTitle || 'Mi Aplicación',
      content: bodyContent
    });

    return fullPage;
  }

  /**
   * Compone una página simple sin sidebar
   * 
   * Variante de composición para páginas que no requieren sidebar.
   * Demuestra la flexibilidad del patrón Composite View.
   * 
   * @param {Object} pageData - Datos para la página simple
   * @param {string} pageData.pageTitle - Título de la página
   * @param {Object} [pageData.header] - Datos para el header
   * @param {Object} pageData.content - Datos para el contenido
   * @param {Object} [pageData.footer] - Datos para el footer
   * 
   * @returns {string} HTML completo de la página sin sidebar
   * 
   * @example
   * const html = composer.composeSimplePage({
   *   pageTitle: 'Landing Page',
   *   content: { title: 'Welcome' }
   * });
   */
  composeSimplePage(pageData) {
    // Genera los componentes necesarios
    const headerHTML = this.components.header(pageData.header || {});
    const contentHTML = this.components.content(pageData.content || {});
    const footerHTML = this.components.footer(pageData.footer || {});

    // Compone sin sidebar (estructura más simple)
    const bodyContent = `
      ${headerHTML}
      <div class="container">
        <div style="padding: 2rem 0;">
          ${contentHTML}
        </div>
      </div>
      ${footerHTML}
    `;

    // Envuelve en el layout
    const fullPage = this.components.layout({
      title: pageData.pageTitle || 'Mi Aplicación',
      content: bodyContent
    });

    return fullPage;
  }

  /**
   * Registra un nuevo componente de vista
   * 
   * Permite extender el compositor con nuevos componentes personalizados.
   * Esto demuestra la extensibilidad del patrón.
   * 
   * @param {string} name - Nombre del componente
   * @param {Function} component - Función que genera el HTML del componente
   * 
   * @example
   * composer.registerComponent('banner', (data) => {
   *   return `<div class="banner">${data.message}</div>`;
   * });
   */
  registerComponent(name, component) {
    if (typeof component !== 'function') {
      throw new Error('El componente debe ser una función');
    }
    this.components[name] = component;
  }

  /**
   * Renderiza un componente individual
   * 
   * Útil para obtener solo un componente específico sin composición.
   * 
   * @param {string} componentName - Nombre del componente a renderizar
   * @param {Object} data - Datos para el componente
   * 
   * @returns {string} HTML del componente individual
   * 
   * @throws {Error} Si el componente no existe
   * 
   * @example
   * const headerHtml = composer.renderComponent('header', { title: 'Blog' });
   */
  renderComponent(componentName, data = {}) {
    const component = this.components[componentName];
    
    if (!component) {
      throw new Error(`Componente '${componentName}' no encontrado`);
    }

    return component(data);
  }
}

// Exporta la clase ViewComposer
module.exports = ViewComposer;
