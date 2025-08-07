// Espera a que el contenido del DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {

    // === Funcionalidad Botón Volver Arriba (Sin cambios, código correcto) ===
    const scrollTopButton = document.getElementById("scrollTopBtn");
    if (scrollTopButton) {
        const scrollThreshold = 300;
        const toggleScrollTopButton = () => {
            if (window.scrollY > scrollThreshold || document.documentElement.scrollTop > scrollThreshold) {
                scrollTopButton.classList.add("visible");
            } else {
                scrollTopButton.classList.remove("visible");
            }
        };
        window.addEventListener('scroll', toggleScrollTopButton);
        scrollTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        toggleScrollTopButton(); // Check on initial load
    }

    // === Variables y Funciones Globales para Filtros ===
    const searchInput = document.getElementById('search-input');
    const allDashboardItems = document.querySelectorAll('.dashboard-section .dashboard-item');
    const filterContainer = document.getElementById('section-filters');

    // === Funcionalidad de Búsqueda en Vivo (Refactorizada y más limpia) ===
    const applySearchFilter = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        allDashboardItems.forEach(item => {
            const parentSection = item.closest('.dashboard-section');
            const isSectionVisible = parentSection && parentSection.style.display !== 'none';

            // Ocultar si la sección contenedora está oculta por el filtro de sección
            if (!isSectionVisible) {
                item.style.display = 'none';
                return; // Salir temprano
            }

            // Para items normales, aplicar filtro de texto
            const title = item.querySelector('h3')?.textContent.toLowerCase() || '';
            const description = item.querySelector('p')?.textContent.toLowerCase() || '';
            const isMatch = title.includes(searchTerm) || description.includes(searchTerm);

            // Mostrar si no hay término de búsqueda o si el texto coincide
            if (searchTerm === '' || isMatch) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    };
    
    if (searchInput && allDashboardItems.length > 0) {
        searchInput.addEventListener('input', applySearchFilter);
        // También manejar el evento 'search' para cuando el usuario limpia el campo con la 'x'
        searchInput.addEventListener('search', () => {
            if (searchInput.value === '') applySearchFilter();
        });
    }

    // === Funcionalidad Filtro por Secciones (Sin cambios, código correcto y eficiente) ===
    if (filterContainer) {
        filterContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                const filterValue = e.target.getAttribute('data-filter');
                filterContainer.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');

                document.querySelectorAll('.dashboard-section').forEach(section => {
                    section.style.display = (filterValue === 'all' || section.id === filterValue) ? '' : 'none';
                });

                // Re-aplicar el filtro de búsqueda después de cambiar de sección
                applySearchFilter();
            }
        });
    }


    // === MEJORA PRINCIPAL: Funcionalidad Comparador de Dashboards (Ahora es automático) ===
    const selector1 = document.getElementById('select-dashboard-1');
    const selector2 = document.getElementById('select-dashboard-2');
    const iframe1 = document.querySelector('#iframe-slot-1 iframe');
    const iframe2 = document.querySelector('#iframe-slot-2 iframe');

    if (selector1 && selector2 && iframe1 && iframe2) {
        
        // MEJORA: Generar la lista de dashboards dinámicamente desde el HTML
        const availableDashboardsForComparison = [];
        const dashboardLinks = document.querySelectorAll('.dashboard-item a[href*="app.powerbi.com"]');

        dashboardLinks.forEach(link => {
            const name = link.querySelector('h3')?.textContent.trim() || 'Dashboard sin título';
            let url = link.href;

            // Convertir URL de "linkShare" a "reportEmbed" para que funcione en el iframe
            if (url.includes("/links/")) {
                const reportId = url.split('/links/')[1].split('?')[0];
                const ctid = new URL(url).searchParams.get('ctid');
                // Asumimos una estructura de URL embebible estándar. Ajustar si es necesario.
                url = `https://app.powerbi.com/reportEmbed?reportId=${reportId}&autoAuth=true&ctid=${ctid}`;
            } else if (!url.includes("reportEmbed")) {
                // Si la URL no es de tipo 'link' ni 'embed', la saltamos para evitar errores.
                return;
            }
            
            availableDashboardsForComparison.push({ name, url });
        });
        
        // Llenar los desplegables (selectores) con la lista generada
        availableDashboardsForComparison.forEach(dashboard => {
            const option = document.createElement('option');
            option.value = dashboard.url;
            option.textContent = dashboard.name;
            selector1.appendChild(option.cloneNode(true));
            selector2.appendChild(option);
        });

        // Función para actualizar iframes (sin cambios en su lógica interna)
        const updateIframe = (selector, iframeElement) => {
            const selectedUrl = selector.value;
            if (selectedUrl) {
                iframeElement.src = selectedUrl;
                iframeElement.style.visibility = 'visible';
            } else {
                iframeElement.src = 'about:blank';
                iframeElement.style.visibility = 'hidden';
            }
        };

        selector1.addEventListener('change', () => updateIframe(selector1, iframe1));
        selector2.addEventListener('change', () => updateIframe(selector2, iframe2));
    }

}); // Fin del DOMContentLoaded
