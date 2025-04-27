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
                    // Opcional: Limpiar búsqueda al cambiar filtro de sección
                    // if (searchInput) searchInput.value = '';
                    // applySearchFilter(); // Re-aplicar filtro de búsqueda (vacío)
                }
            });
        }
    }
    // === Fin Funcionalidad Filtro por Secciones ===
    // ============================================


    // === Funcionalidad Búsqueda en Vivo ===
    // ====================================
    const searchInput = document.getElementById('search-input');
    const dashboardItems = document.querySelectorAll('.dashboard-item');
    if (searchInput && dashboardItems.length > 0) {

        // Función para aplicar el filtro de búsqueda (para poder llamarla también al cambiar sección)
        const applySearchFilter = () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            dashboardItems.forEach(item => {
                const titleElement = item.querySelector('h3');
                const descriptionElement = item.querySelector('p');
                const title = titleElement ? titleElement.textContent.toLowerCase() : '';
                const description = descriptionElement ? descriptionElement.textContent.toLowerCase() : '';
                const isMatch = title.includes(searchTerm) || description.includes(searchTerm);

                // IMPORTANTE: Solo ocultar/mostrar si la sección padre está visible
                const parentSection = item.closest('.dashboard-section');
                const isSectionVisible = !parentSection || parentSection.style.display !== 'none';

                if (isSectionVisible && (searchTerm === '' || isMatch)) {
                    item.style.display = ''; // Usa el display por defecto (flex)
                } else {
                    item.style.display = 'none';
                }
            });
        }

        // Escuchar el evento 'input' para búsqueda en tiempo real
        searchInput.addEventListener('input', applySearchFilter);

        // Si se limpia la búsqueda con la 'x', también se dispara 'input',
        // pero aseguramos por si acaso con 'search' event
         searchInput.addEventListener('search', () => {
            // El evento 'input' ya maneja esto, pero puede ser un fallback
            if(searchInput.value === '') {
                 applySearchFilter();
            }
         });


        // --- Modificación para Interacción con Filtros de Sección ---
        // Re-aplicar el filtro de búsqueda CADA VEZ que se cambia un filtro de sección
        if (filterContainer) {
             filterContainer.addEventListener('click', (e) => {
                 if (e.target.classList.contains('filter-btn')) {
                     // Esperar un instante muy pequeño para que el filtro de sección termine de aplicarse
                     // antes de re-aplicar el filtro de búsqueda a los elementos ahora visibles.
                     setTimeout(applySearchFilter, 0);
                 }
             });
         }
         // Aplicar filtro inicial por si la página carga con texto en la búsqueda (poco probable)
         applySearchFilter();

    } // Fin if (searchInput y dashboardItems existen)
    // === Fin Funcionalidad Búsqueda en Vivo ===
    // ========================================


}); // Fin del DOMContentLoaded
