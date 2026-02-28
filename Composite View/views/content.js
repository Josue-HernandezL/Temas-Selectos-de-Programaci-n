/**
 * @fileoverview Componente de vista Content
 * 
 * Este componente representa el área de contenido principal de la página.
 * Es dinámico y puede mostrar diferentes tipos de contenido.
 * 
 * @author Temas Selectos de Programación
 * @version 1.0.0
 */

/**
 * Genera el HTML del componente Content
 * 
 * Este componente muestra el contenido principal de la página.
 * Puede recibir diferentes tipos de datos para renderizar.
 * 
 * @param {Object} data - Datos para el contenido
 * @param {string} data.title - Título del contenido
 * @param {string} data.body - Cuerpo del contenido (puede incluir HTML)
 * @param {Array<Object>} [data.items] - Lista de items a mostrar
 * 
 * @returns {string} HTML del componente de contenido
 * 
 * @example
 * const html = contentView({ 
 *   title: 'Bienvenido',
 *   body: '<p>Este es el contenido principal</p>'
 * });
 */
function contentView(data = {}) {
  const title = data.title || 'Contenido Principal';
  const body = data.body || '<p>Aquí va el contenido de la página.</p>';
  const items = data.items || [];

  // Si hay items, genera una lista
  let itemsHTML = '';
  if (items.length > 0) {
    const itemsList = items
      .map(item => `
        <div class="card">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          ${item.link ? `<a href="${item.link}">Leer más</a>` : ''}
        </div>
      `)
      .join('');
    
    itemsHTML = `
      <div class="items-grid">
        ${itemsList}
      </div>
    `;
  }

  return `
    <main class="content">
      <h2>${title}</h2>
      <div class="content-body">
        ${body}
      </div>
      ${itemsHTML}
    </main>
  `;
}

// Exporta la función del componente
module.exports = contentView;
