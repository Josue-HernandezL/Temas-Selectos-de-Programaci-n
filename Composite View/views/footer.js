/**
 * @fileoverview Componente de vista Footer
 * 
 * Este componente representa el pie de página de la aplicación.
 * Es una vista atómica que muestra información de copyright y enlaces.
 * 
 * @author Temas Selectos de Programación
 * @version 1.0.0
 */

/**
 * Genera el HTML del componente Footer
 * 
 * Este componente muestra el pie de página con información de copyright
 * y enlaces a redes sociales.
 * 
 * @param {Object} data - Datos opcionales para el footer
 * @param {number} [data.year] - Año para el copyright (por defecto año actual)
 * @param {string} [data.company='Mi Empresa'] - Nombre de la empresa
 * 
 * @returns {string} HTML del componente footer
 * 
 * @example
 * const html = footerView({ year: 2026, company: 'TechCorp' });
 */
function footerView(data = {}) {
  const year = data.year || new Date().getFullYear();
  const company = data.company || 'Mi Empresa';

  return `
    <footer class="footer">
      <div class="container">
        <p>&copy; ${year} ${company}. Todos los derechos reservados.</p>
        <div class="social-links">
          <a href="#">Facebook</a>
          <a href="#">Twitter</a>
          <a href="#">LinkedIn</a>
        </div>
      </div>
    </footer>
  `;
}

// Exporta la función del componente
module.exports = footerView;
