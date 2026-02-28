/**
 * @fileoverview Componente de vista Header
 * 
 * Este componente representa el encabezado de la página web.
 * Es una vista atómica que puede ser reutilizada en diferentes layouts.
 * 
 * @author Temas Selectos de Programación
 * @version 1.0.0
 */

/**
 * Genera el HTML del componente Header
 * 
 * Este componente muestra el encabezado de la aplicación con el título
 * y la navegación principal.
 * 
 * @param {Object} data - Datos opcionales para el header
 * @param {string} [data.title='Mi Aplicación'] - Título del sitio
 * @param {string} [data.user] - Nombre del usuario logueado
 * 
 * @returns {string} HTML del componente header
 * 
 * @example
 * const html = headerView({ title: 'Blog', user: 'Juan' });
 */
function headerView(data = {}) {
  const title = data.title || 'Mi Aplicación';
  const user = data.user || 'Invitado';

  return `
    <header class="header">
      <div class="container">
        <h1>${title}</h1>
        <nav>
          <ul>
            <li><a href="/">Inicio</a></li>
            <li><a href="/about">Acerca de</a></li>
            <li><a href="/contact">Contacto</a></li>
            <li class="user-info">👤 ${user}</li>
          </ul>
        </nav>
      </div>
    </header>
  `;
}

// Exporta la función del componente
module.exports = headerView;
