// Espera a que el contenido del DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', (event) => {

    // === Funcionalidad Botón Volver Arriba ===
    // =========================================
    let scrollTopButton = document.getElementById("scrollTopBtn");
    if (scrollTopButton) {
        const scrollThreshold = 300;
        const toggleScrollTopButton = () => {
            if (window.scrollY > scrollThreshold || document.documentElement.scrollTop > scrollThreshold) {
                scrollTopButton.classList.add("visible");
            } else {
                scrollTopButton.classList.remove("visible");
            }
        };
        const scrollToTop = () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        window.addEventListener('scroll', toggleScrollTopButton);
        scrollTopButton.addEventListener('click', scrollToTop);
        toggleScrollTopButton(); // Check on load
    }
    // === Fin Funcionalidad Botón Volver Arriba ===
    // =============================================


    // === Funcionalidad Filtro por Secciones ===
    // ========================================
    const filterContainer = document.getElementById('section-filters');
    if (filterContainer) {
        const filterButtons = filterContainer.querySelectorAll('.filter-btn');
        const dashboardSections = document.querySelectorAll('.dashboard-section');
        if (filterButtons.length > 0 && dashboardSections.length > 0) {
            filterContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-btn')) {
                    const filterValue = e.target.getAttribute('data-filter');
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    e.target.classList.add('active');
                    dashboardSections.forEach(section => {
                        if (filterValue === 'all' || section.id === filterValue) {
                            section.style.display = '';
                        } else {
                            section.style.display = 'none';
                        }
                    });
                    // Disparar un re-filtro de búsqueda después de cambiar filtro de sección
                    if (typeof applySearchFilter === 'function') { // Asegurar que la función exista
                        setTimeout(applySearchFilter, 0); // Pequeño delay para que el DOM actualice display
                    }
                }
            });
        }
    }
    // === Fin Funcionalidad Filtro por Secciones ===
    // ============================================


    // === Funcionalidad Búsqueda en Vivo ===
    // ====================================
    const searchInput = document.getElementById('search-input');
    // Seleccionamos todos los items que pueden ser filtrados (los de enlaces y los de iframes)
    const allDashboardItems = document.querySelectorAll('.dashboard-section .dashboard-item'); 
    
    // Declarar applySearchFilter en un scope accesible para que los filtros de sección puedan llamarla
    let applySearchFilter = () => {}; 

    if (searchInput && allDashboardItems.length > 0) {
        applySearchFilter = () => { // Asignar la función
            const searchTerm = searchInput.value.toLowerCase().trim();
            allDashboardItems.forEach(item => {
                const titleElement = item.querySelector('h3');
                const descriptionElement = item.querySelector('p');
                const title = titleElement ? titleElement.textContent.toLowerCase() : '';
                const description = descriptionElement ? descriptionElement.textContent.toLowerCase() : '';
                const isMatch = title.includes(searchTerm) || description.includes(searchTerm);

                const parentSection = item.closest('.dashboard-section');
                const isSectionFilteredOut = parentSection && parentSection.style.display === 'none';

                if (isSectionFilteredOut) {
                    // Si la sección padre está oculta por el filtro de sección, el item también debe estarlo
                    item.style.display = 'none'; 
                } else if (searchTerm === '' || isMatch) {
                    item.style.display = ''; // Usa el display por defecto (flex)
                } else {
                    item.style.display = 'none';
                }
            });
        }

        searchInput.addEventListener('input', applySearchFilter);
        searchInput.addEventListener('search', () => { // Para el botón 'x' del input type search
            if(searchInput.value === '') {
                 applySearchFilter();
            }
         });

        // Aplicar filtro inicial por si la página carga con texto en la búsqueda
        applySearchFilter(); 
    }
    // === Fin Funcionalidad Búsqueda en Vivo ===
    // ========================================

}); // Fin del DOMContentLoaded
