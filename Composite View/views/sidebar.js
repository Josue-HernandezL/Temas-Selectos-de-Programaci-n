/**
 * @fileoverview Componente de vista Sidebar
 * 
 * Este componente representa la barra lateral de la aplicación.
 * Muestra widgets y navegación secundaria.
 * 
 * @author Temas Selectos de Programación
 * @version 1.0.0
 */

/**
 * Genera el HTML del componente Sidebar
 * 
 * Este componente muestra una barra lateral con widgets y menú secundario.
 * 
 * @param {Object} data - Datos opcionales para el sidebar
 * @param {Array<string>} [data.categories] - Lista de categorías
 * @param {Array<Object>} [data.recentPosts] - Posts recientes
 * 
 * @returns {string} HTML del componente sidebar
 * 
 * @example
 * const html = sidebarView({ 
 *   categories: ['Tecnología', 'Ciencia'],
 *   recentPosts: [{ title: 'Post 1', link: '/post-1' }]
 * });
 */
function sidebarView(data = {}) {
  const categories = data.categories || ['Tecnología', 'Diseño', 'Programación'];
  const recentPosts = data.recentPosts || [
    { title: 'Introducción a Patrones de Diseño', link: '#' },
    { title: 'Arquitectura de Software', link: '#' },
    { title: 'Clean Code en JavaScript', link: '#' }
  ];

  // Genera el HTML de las categorías
  const categoriesHTML = categories
    .map(cat => `<li><a href="#">${cat}</a></li>`)
    .join('');

  // Genera el HTML de los posts recientes
  const postsHTML = recentPosts
    .map(post => `<li><a href="${post.link}">${post.title}</a></li>`)
    .join('');

  return `
    <aside class="sidebar">
      <div class="widget">
        <h3>Categorías</h3>
        <ul>
          ${categoriesHTML}
        </ul>
      </div>
      
      <div class="widget">
        <h3>Posts Recientes</h3>
        <ul>
          ${postsHTML}
        </ul>
      </div>
      
      <div class="widget">
        <h3>Newsletter</h3>
        <form>
          <input type="email" placeholder="Tu email">
          <button type="submit">Suscribirse</button>
        </form>
      </div>
    </aside>
  `;
}

// Exporta la función del componente
module.exports = sidebarView;
