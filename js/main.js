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

    // Declarar applySearchFilter en un scope más amplio para ser accesible por el filtro de sección
    let applySearchFilter = () => {}; 

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
                    if (typeof applySearchFilter === 'function') { 
                        setTimeout(applySearchFilter, 50); 
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
    const allDashboardItemsForSearch = document.querySelectorAll('.dashboard-section .dashboard-item'); 
    
    if (searchInput && allDashboardItemsForSearch.length > 0) {
        applySearchFilter = () => { 
            const searchTerm = searchInput.value.toLowerCase().trim();
            allDashboardItemsForSearch.forEach(item => {
                const titleElement = item.querySelector('h3');
                const descriptionElement = item.querySelector('p');
                const isIframeSlot = item.classList.contains('iframe-slot'); // Comprobar si es un slot de iframe

                // Si es un slot de iframe, no intentamos leer título/descripción para filtrar por texto
                if (isIframeSlot) {
                     const parentSection = item.closest('.dashboard-section');
                     const isSectionFilteredOut = parentSection && parentSection.style.display === 'none';
                     if (isSectionFilteredOut) {
                        item.style.display = 'none';
                     } else {
                        item.style.display = ''; // Los slots de iframe se muestran/ocultan solo por filtro de sección
                     }
                     return; // Saltar el resto de la lógica para este item
                }

                // Para items normales (no slots de iframe del comparador)
                const title = titleElement ? titleElement.textContent.toLowerCase() : '';
                const description = descriptionElement ? descriptionElement.textContent.toLowerCase() : '';
                const isMatch = title.includes(searchTerm) || description.includes(searchTerm);

                const parentSection = item.closest('.dashboard-section');
                const isSectionFilteredOut = parentSection && parentSection.style.display === 'none';

                if (isSectionFilteredOut) {
                    item.style.display = 'none'; 
                } else if (searchTerm === '' || isMatch) {
                    item.style.display = ''; 
                } else {
                    item.style.display = 'none';
                }
            });
        }

        searchInput.addEventListener('input', applySearchFilter);
        searchInput.addEventListener('search', () => { 
            if(searchInput.value === '') {
                 applySearchFilter();
            }
         });
        
         applySearchFilter(); // Aplicar filtro inicial
    }
    // === Fin Funcionalidad Búsqueda en Vivo ===
    // ========================================


    // === Funcionalidad Comparador de Dashboards Embebidos ===
    // =======================================================
    const availableDashboardsForComparison = [
        // Tableros de áreas - DDM
        { name: "DDM: Tablero - Comité", url: "https://app.powerbi.com/reportEmbed?reportId=fb2253ab-7140-481e-ac20-f8a867b13927&autoAuth=true&ctid=8d95905e-4c9c-4212-bd40-d6dba7f50768" },
        { name: "DDM: Tablero - Productividad", url: "https://app.powerbi.com/reportEmbed?reportId=5531db87-21f1-4aa4-a558-bcdc17e51da5&autoAuth=true&ctid=8d95905e-4c9c-4212-bd40-d6dba7f50768" },
        { name: "DDM: Tablero - Capital Humano", url: "https://app.powerbi.com/reportEmbed?reportId=dc682c38-6135-4d8a-9cb0-34cc0c4de3ff&autoAuth=true&ctid=8d95905e-4c9c-4212-bd40-d6dba7f50768" },
        { name: "DDM: Tablero - Calidad", url: "https://app.powerbi.com/reportEmbed?reportId=039e4a3b-2c39-4e05-ab2c-cf3b77fb1573&autoAuth=true&ctid=8d95905e-4c9c-4212-bd40-d6dba7f50768" },
        { name: "DDM: Tablero - I&T", url: "https://app.powerbi.com/reportEmbed?reportId=e1dddee8-9bb9-47a8-be5f-d0395f9a9800&autoAuth=true&ctid=8d95905e-4c9c-4212-bd40-d6dba7f50768" },
        { name: "DDM: Tablero - Comercial", url: "https://app.powerbi.com/reportEmbed?reportId=4c5c9673-58d2-4ab9-aaa5-334ee47e742c&autoAuth=true&ctid=8d95905e-4c9c-4212-bd40-d6dba7f50768" },
        // Reportes - Clientes
        { name: "Cliente: Lenovo", url: "https://app.powerbi.com/reportEmbed?reportId=8b48e567-a677-49a0-adc1-34b1d75ac0db&autoAuth=true&ctid=8d95905e-4c9c-4212-bd40-d6dba7f50768" },
        { name: "Cliente: McCain", url: "https://app.powerbi.com/reportEmbed?reportId=c69afe93-38ec-4fde-a631-d3d311f96090&autoAuth=true&ctid=8d95905e-4c9c-4212-bd40-d6dba7f50768" },
        { name: "Cliente: Qualia", url: "https://app.powerbi.com/reportEmbed?reportId=062a49d4-8869-4ff3-97bd-239c2d358de8&autoAuth=true&ctid=8d95905e-4c9c-4212-bd40-d6dba7f50768" },
        { name: "Cliente: Fundación Huésped", url: "https://app.powerbi.com/reportEmbed?reportId=1e02a090-5e04-4595-82eb-b770ecbaab16&autoAuth=true&ctid=8d95905e-4c9c-4212-bd40-d6dba7f50768" },
        { name: "Cliente: OMINT", url: "https://app.powerbi.com/reportEmbed?reportId=936a2c48-066e-4f4a-a22c-72b23e24a0be&autoAuth=true&ctid=8d95905e-4c9c-4212-bd40-d6dba7f50768" },
        { name: "Cliente: SMG", url: "https://app.powerbi.com/reportEmbed?reportId=599b1476-ab69-45fe-aff1-b95bc97d3842&autoAuth=true&ctid=8d95905e-4c9c-4212-bd40-d6dba7f50768" },
        { name: "Cliente: SANCOR", url: "https://app.powerbi.com/reportEmbed?reportId=620ccc5c-ff54-492a-9904-411acffa8533&autoAuth=true&ctid=8d95905e-4c9c-4212-bd40-d6dba7f50768" },
        { name: "Cliente: SYNGENTA", url: "https://app.powerbi.com/reportEmbed?reportId=9b2374d9-cbe7-4221-93bc-6f2fdb940910&autoAuth=true&ctid=8d95905e-4c9c-4212-bd40-d6dba7f50768" },
        // Reportes - Internos
        { name: "Interno: Lenovo", url: "https://app.powerbi.com/reportEmbed?reportId=bc523d79-ae61-4da2-b58d-ce3f0b85aa6c&autoAuth=true&ctid=8d95905e-4c9c-4212-bd40-d6dba7f50768" },
        { name: "Interno: Qualia", url: "https://app.powerbi.com/reportEmbed?reportId=b723a00e-5d8e-495a-a9d6-96b0501ce1d3&autoAuth=true&ctid=8d95905e-4c9c-4212-bd40-d6dba7f50768" },
        { name: "Interno: Fundación Huésped", url: "https://app.powerbi.com/reportEmbed?reportId=b8ef8ea5-a439-4e52-99fd-9a52c50508e0&autoAuth=true&ctid=8d95905e-4c9c-4212-bd40-d6dba7f50768" },
        { name: "Interno: OMINT", url: "https://app.powerbi.com/reportEmbed?reportId=6eb17020-7fdb-4ad4-9181-118462d6f6dd&autoAuth=true&ctid=8d95905e-4c9c-4212-bd40-d6dba7f50768" },
        { name: "Interno: SMG", url: "https://app.powerbi.com/reportEmbed?reportId=ee01b691-401b-4b1b-8d7c-8e739d7db85e&autoAuth=true&ctid=8d95905e-4c9c-4212-bd40-d6dba7f50768" },
        { name: "Interno: SMG (Leads)", url: "https://app.powerbi.com/reportEmbed?reportId=b966e88f-ec00-4c2f-bf53-230a8abbb369&autoAuth=true&ctid=8d95905e-4c9c-4212-bd40-d6dba7f50768" },
        { name: "Interno: SANCOR", url: "https://app.powerbi.com/reportEmbed?reportId=e95331ca-c80a-4fed-ace1-75d0702870ff&autoAuth=true&ctid=8d95905e-4c9c-4212-bd40-d6dba7f50768" },
        { name: "Interno: SYNGENTA", url: "https://app.powerbi.com/reportEmbed?reportId=785e2339-0781-4140-a8f4-894b89bbda19&autoAuth=true&ctid=8d95905e-4c9c-4212-bd40-d6dba7f50768" },
        { name: "Interno: Multicampaña", url: "https://app.powerbi.com/reportEmbed?reportId=debc147a-2df7-448d-bbcb-ddad4da399c8&autoAuth=true&ctid=8d95905e-4c9c-4212-bd40-d6dba7f50768" },
        { name: "Interno: Encuesta (clima)", url: "https://app.powerbi.com/reportEmbed?reportId=800d1a40-2072-4524-9d02-3fc23be9358c&autoAuth=true&ctid=8d95905e-4c9c-4212-bd40-d6dba7f50768" },
        // Análisis de bases
        { name: "Análisis: QUALIA (salud)", url: "https://app.powerbi.com/reportEmbed?reportId=1579eefd-9930-4291-bac0-bce628d95a2f&autoAuth=true&ctid=8d95905e-4c9c-4212-bd40-d6dba7f50768" },
        { name: "Análisis: QUALIA (vida)", url: "https://app.powerbi.com/reportEmbed?reportId=6e6573fe-399a-470f-83df-976d19029dd1&autoAuth=true&ctid=8d95905e-4c9c-4212-bd40-d6dba7f50768" },
        { name: "Análisis: SMG", url: "https://app.powerbi.com/reportEmbed?reportId=5466d805-4b8d-4300-9ca0-c5a4f0ca9570&autoAuth=true&ctid=8d95905e-4c9c-4212-bd40-d6dba7f50768" }
    ];

    const selector1 = document.getElementById('select-dashboard-1');
    const selector2 = document.getElementById('select-dashboard-2');
    const iframe1 = document.querySelector('#iframe-slot-1 iframe');
    const iframe2 = document.querySelector('#iframe-slot-2 iframe');

    if (selector1 && selector2 && iframe1 && iframe2 && availableDashboardsForComparison.length > 0) {
        // Llenar los desplegables
        availableDashboardsForComparison.forEach(dashboard => {
            const option = document.createElement('option');
            option.value = dashboard.url;
            option.textContent = dashboard.name;
            selector1.appendChild(option.cloneNode(true)); 
            selector2.appendChild(option);
        });

        // Función para actualizar iframes
        const updateIframe = (selector, iframeElement) => {
            const selectedUrl = selector.value;
            const placeholder = iframeElement.closest('.iframe-slot').querySelector('.iframe-placeholder');
            
            if (selectedUrl) {
                iframeElement.src = selectedUrl;
                iframeElement.style.visibility = 'visible'; 
                if(placeholder) placeholder.style.display = 'none'; 
            } else {
                iframeElement.src = 'about:blank';
                iframeElement.style.visibility = 'hidden'; 
                if(placeholder) placeholder.style.display = 'block'; 
            }
        };

        // Event listeners para los desplegables
        selector1.addEventListener('change', () => updateIframe(selector1, iframe1));
        selector2.addEventListener('change', () => updateIframe(selector2, iframe2));
    }
    // === Fin Funcionalidad Comparador de Dashboards Embebidos ===
    // ===========================================================

}); // Fin del DOMContentLoaded
