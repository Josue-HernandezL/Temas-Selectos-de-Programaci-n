/**
 * @fileoverview Componente de vista Layout
 * 
 * Este componente define la estructura HTML base de la página,
 * incluyendo los estilos CSS y la estructura general.
 * 
 * @author Temas Selectos de Programación
 * @version 1.0.0
 */

/**
 * Genera el HTML completo del layout base
 * 
 * Este componente proporciona la estructura HTML completa incluyendo
 * DOCTYPE, head con estilos, y el body que contendrá los componentes.
 * 
 * @param {Object} data - Datos para el layout
 * @param {string} data.title - Título de la página (para el tag <title>)
 * @param {string} data.content - Contenido HTML a insertar en el body
 * 
 * @returns {string} HTML completo de la página
 * 
 * @example
 * const html = layoutView({ 
 *   title: 'Mi Página',
 *   content: '<div>Contenido compuesto</div>'
 * });
 */
function layoutView(data = {}) {
  const pageTitle = data.title || 'Composite View Pattern';
  const content = data.content || '';

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    /* Header Styles */
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem 0;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .header h1 {
      margin-bottom: 1rem;
    }

    .header nav ul {
      list-style: none;
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .header nav a {
      color: white;
      text-decoration: none;
      transition: opacity 0.3s;
    }

    .header nav a:hover {
      opacity: 0.8;
    }

    .user-info {
      margin-left: auto;
      font-weight: bold;
    }

    /* Main Layout */
    .main-wrapper {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 2rem;
      padding: 2rem 0;
      min-height: calc(100vh - 200px);
    }

    /* Content Styles */
    .content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .content h2 {
      color: #667eea;
      margin-bottom: 1.5rem;
    }

    .content-body {
      margin-bottom: 2rem;
    }

    .items-grid {
      display: grid;
      gap: 1.5rem;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }

    .card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1.5rem;
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .card h3 {
      color: #667eea;
      margin-bottom: 0.5rem;
    }

    .card a {
      color: #667eea;
      text-decoration: none;
      font-weight: bold;
    }

    /* Sidebar Styles */
    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .widget {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .widget h3 {
      color: #667eea;
      margin-bottom: 1rem;
      border-bottom: 2px solid #667eea;
      padding-bottom: 0.5rem;
    }

    .widget ul {
      list-style: none;
    }

    .widget ul li {
      padding: 0.5rem 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .widget ul li:last-child {
      border-bottom: none;
    }

    .widget a {
      color: #333;
      text-decoration: none;
      transition: color 0.3s;
    }

    .widget a:hover {
      color: #667eea;
    }

    .widget form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .widget input {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .widget button {
      padding: 0.5rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s;
    }

    .widget button:hover {
      background: #5568d3;
    }

    /* Footer Styles */
    .footer {
      background: #2c3e50;
      color: white;
      padding: 2rem 0;
      margin-top: 2rem;
    }

    .footer .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .social-links {
      display: flex;
      gap: 1rem;
    }

    .social-links a {
      color: white;
      text-decoration: none;
      transition: opacity 0.3s;
    }

    .social-links a:hover {
      opacity: 0.8;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .main-wrapper {
        grid-template-columns: 1fr;
      }

      .header nav ul {
        flex-direction: column;
        gap: 0.5rem;
      }

      .footer .container {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
    }
  </style>
</head>
<body>
  ${content}
</body>
</html>
  `;
}

// Exporta la función del componente
module.exports = layoutView;
