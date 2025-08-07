// Espera a que el contenido del DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {

    // === Funcionalidad Botón Volver Arriba ===
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
        toggleScrollTopButton();
    }

    // === Variables y Funciones Globales para Filtros ===
    const searchInput = document.getElementById('search-input');
    const allDashboardItems = document.querySelectorAll('.dashboard-item');
    const filterContainer = document.getElementById('section-filters');

    // === Funcionalidad de Búsqueda en Vivo ===
    const applySearchFilter = () => {
        if (!searchInput) return;
        const searchTerm = searchInput.value.toLowerCase().trim();

        allDashboardItems.forEach(item => {
            const parentSection = item.closest('.dashboard-section');
            const isSectionVisible = parentSection && parentSection.style.display !== 'none';
            
            if (!isSectionVisible) {
                item.style.display = 'none';
                return;
            }

            const title = item.querySelector('h3')?.textContent.toLowerCase() || '';
            const description = item.querySelector('p')?.textContent.toLowerCase() || '';
            const isMatch = title.includes(searchTerm) || description.includes(searchTerm);

            item.style.display = (searchTerm === '' || isMatch) ? '' : 'none';
        });
    };
    
    if (searchInput) {
        searchInput.addEventListener('input', applySearchFilter);
        searchInput.addEventListener('search', () => {
            if (searchInput.value === '') applySearchFilter();
        });
    }

    // === Funcionalidad Filtro por Secciones ===
    if (filterContainer) {
        filterContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                const filterValue = e.target.getAttribute('data-filter');
                filterContainer.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');

                document.querySelectorAll('.dashboard-section').forEach(section => {
                    section.style.display = (filterValue === 'all' || section.id === filterValue) ? '' : 'none';
                });

                applySearchFilter();
            }
        });
    }


    // === Funcionalidad Comparador de Dashboards (Automático) ===
    const selector1 = document.getElementById('select-dashboard-1');
    const selector2 = document.getElementById('select-dashboard-2');
    const iframe1 = document.querySelector('#iframe-slot-1 iframe');
    const iframe2 = document.querySelector('#iframe-slot-2 iframe');

    if (selector1 && selector2 && iframe1 && iframe2) {
        
        const availableDashboards = [];
        const dashboardLinks = document.querySelectorAll('.dashboard-item a[href*="app.powerbi.com"]');

        dashboardLinks.forEach(link => {
            const name = link.querySelector('h3')?.textContent.trim() || 'Dashboard sin título';
            let url = link.href;

            if (url.includes("/links/")) {
                try {
                    const urlParams = new URL(url);
                    const reportIdWithParams = url.split('/links/')[1];
                    const reportId = reportIdWithParams.split('?')[0];
                    const ctid = urlParams.searchParams.get('ctid');
                    if (reportId && ctid) {
                       url = `https://app.powerbi.com/reportEmbed?reportId=${reportId}&autoAuth=true&ctid=${ctid}`;
                    }
                } catch (error) {
                    console.error("Error parsing Power BI URL: ", error);
                    return; // Skip this link if URL is malformed
                }
            } else if (!url.includes("reportEmbed")) {
                return; // Skip non-embeddable links
            }
            
            availableDashboards.push({ name, url });
        });
        
        availableDashboards.forEach(dashboard => {
            const option = new Option(dashboard.name, dashboard.url);
            selector1.add(option.cloneNode(true));
            selector2.add(option);
        });

        const updateIframe = (selector, iframe) => {
            const selectedUrl = selector.value;
            const placeholder = iframe.previousElementSibling;
            if (selectedUrl) {
                iframe.src = selectedUrl;
                iframe.style.visibility = 'visible';
                if(placeholder) placeholder.style.display = 'none';
            } else {
                iframe.src = 'about:blank';
                iframe.style.visibility = 'hidden';
                if(placeholder) placeholder.style.display = 'block';
            }
        };

        selector1.addEventListener('change', () => updateIframe(selector1, iframe1));
        selector2.addEventListener('change', () => updateIframe(selector2, iframe2));
    }

    // Aplicar filtros al cargar la página por si hay algún filtro activo por defecto
    applySearchFilter();

});
