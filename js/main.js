document.addEventListener('DOMContentLoaded', () => {

    // === Funcionalidad Botón Volver Arriba ===
    const scrollTopButton = document.getElementById("scrollTopBtn");
    if (scrollTopButton) {
        window.addEventListener('scroll', () => {
            scrollTopButton.classList.toggle("visible", window.scrollY > 300);
        });
        scrollTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // === Lógica de Filtros y Búsqueda ===
    const searchInput = document.getElementById('search-input');
    const filterContainer = document.getElementById('section-filters');
    const allDashboardItems = document.querySelectorAll('.dashboard-section .dashboard-item');

    const applyFilters = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const activeFilter = filterContainer.querySelector('.filter-btn.active').dataset.filter;

        document.querySelectorAll('.dashboard-section').forEach(section => {
            const isSectionVisibleByFilter = activeFilter === 'all' || section.id === activeFilter;
            section.style.display = isSectionVisibleByFilter ? '' : 'none';

            if (isSectionVisibleByFilter) {
                section.querySelectorAll('.dashboard-item').forEach(item => {
                    const title = item.querySelector('h3')?.textContent.toLowerCase() || '';
                    const description = item.querySelector('p')?.textContent.toLowerCase() || '';
                    const isMatch = title.includes(searchTerm) || description.includes(searchTerm);
                    item.style.display = isMatch ? '' : 'none';
                });
            }
        });
    };

    if (filterContainer) {
        filterContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                filterContainer.querySelector('.filter-btn.active').classList.remove('active');
                e.target.classList.add('active');
                applyFilters();
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    // === MEJORA: Funcionalidad de Comparador de Dashboards Automática ===
    const selector1 = document.getElementById('select-dashboard-1');
    const selector2 = document.getElementById('select-dashboard-2');
    const iframe1 = document.querySelector('#iframe-slot-1 iframe');
    const iframe2 = document.querySelector('#iframe-slot-2 iframe');

    if (selector1 && selector2 && iframe1 && iframe2) {
        
        const availableDashboards = [];
        document.querySelectorAll('.dashboard-item a[href*="app.powerbi.com"]').forEach(link => {
            const name = link.querySelector('h3')?.textContent.trim() || 'Dashboard sin título';
            let url = link.href;

            // Convierte URLs de "compartir" a "embebidas"
            if (url.includes("/links/")) {
                const urlParams = new URL(url);
                const reportId = urlParams.pathname.split('/links/')[1];
                const ctid = urlParams.searchParams.get('ctid');
                url = `https://app.powerbi.com/reportEmbed?reportId=${reportId}&autoAuth=true&ctid=${ctid}`;
            }
            
            if (url.includes("reportEmbed")) {
                 availableDashboards.push({ name, url });
            }
        });
        
        availableDashboards.forEach(dashboard => {
            const option = new Option(dashboard.name, dashboard.url);
            selector1.add(option.cloneNode(true));
            selector2.add(option);
        });

        const updateIframe = (selector, iframe) => {
            iframe.src = selector.value || 'about:blank';
        };

        selector1.addEventListener('change', () => updateIframe(selector1, iframe1));
        selector2.addEventListener('change', () => updateIframe(selector2, iframe2));
    }
});
