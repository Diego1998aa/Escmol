document.addEventListener('DOMContentLoaded', function() {
    // Clock widget functionality
    function updateClock() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('es-CL', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        const dateStr = now.toLocaleDateString('es-CL', {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        document.getElementById('current-time').textContent = timeStr;
        document.getElementById('current-date').textContent = dateStr;
    }

    updateClock();
    setInterval(updateClock, 1000);

    // Carousel functionality
    const carouselContainer = document.querySelector('.hero-carousel .carousel-container');
    if (carouselContainer) {
        const images = carouselContainer.querySelectorAll('img');
        let currentIndex = 0;
        const totalImages = images.length;

        function showImage(index) {
            images.forEach((img, i) => {
                if (i === index) {
                    img.classList.add('active');
                } else {
                    img.classList.remove('active');
                }
            });
        }

        function nextImage() {
            currentIndex = (currentIndex + 1) % totalImages;
            showImage(currentIndex);
        }

        // Start carousel
        showImage(currentIndex);
        setInterval(nextImage, 4000); // Change image every 4 seconds
    }

    // Drag to scroll functionality for news section
    const newsContainer = document.getElementById('news-container');
    const scrollLeftBtn = document.getElementById('scroll-left');
    const scrollRightBtn = document.getElementById('scroll-right');

    if (newsContainer) {
        let isDown = false;
        let startX;
        let scrollLeft;

        newsContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            newsContainer.classList.add('active');
            startX = e.pageX - newsContainer.offsetLeft;
            scrollLeft = newsContainer.scrollLeft;
        });

        newsContainer.addEventListener('mouseleave', () => {
            isDown = false;
            newsContainer.classList.remove('active');
        });

        newsContainer.addEventListener('mouseup', () => {
            isDown = false;
            newsContainer.classList.remove('active');
        });

        // Throttle function to limit event firing frequency
        function throttle(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }

        const handleMouseMove = throttle((e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - newsContainer.offsetLeft;
            const walk = (x - startX) * 4; // increased scroll speed for more fluidity
            newsContainer.scrollLeft = scrollLeft - walk;
        }, 16); // approx 60fps throttle

        newsContainer.addEventListener('mousemove', handleMouseMove);

        // Scroll buttons functionality
        if (scrollLeftBtn && scrollRightBtn) {
            scrollLeftBtn.addEventListener('click', () => {
                newsContainer.scrollBy({
                    left: -300,
                    behavior: 'smooth'
                });
            });

            scrollRightBtn.addEventListener('click', () => {
                newsContainer.scrollBy({
                    left: 300,
                    behavior: 'smooth'
                });
            });
        }
    }

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const modernNav = document.querySelector('.modern-nav');
    
    if (mobileMenuBtn && modernNav) {
        mobileMenuBtn.addEventListener('click', () => {
            modernNav.classList.toggle('hidden');
        });
    }

    // Corregir submenus en móviles y escritorio
    const isMobile = window.innerWidth < 768;
    const submenuButtons = document.querySelectorAll('.modern-nav > div.relative.group > button');
    
    // Función para cerrar todos los submenús
    function closeAllSubmenus() {
        document.querySelectorAll('[id^="submenu-"]').forEach(submenu => {
            submenu.classList.add('opacity-0');
            submenu.classList.add('pointer-events-none');
            
            // Asegurarse de que no esté con display: block forzado
            submenu.style.display = '';
            
            // Establecer el atributo aria-expanded como falso
            const buttonId = submenu.getAttribute('aria-labelledby');
            if (buttonId) {
                const button = document.getElementById(buttonId);
                if (button) button.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Solo configurar eventos de clic para móviles
    if (isMobile) {
        submenuButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const submenuId = button.getAttribute('aria-controls');
                const submenu = document.getElementById(submenuId);
                
                if (submenu) {
                    // Primero cierra todos los submenús
                    closeAllSubmenus();
                    
                    // Luego abre solo el actual
                    const isHidden = submenu.classList.contains('opacity-0');
                    if (isHidden) {
                        submenu.classList.remove('opacity-0');
                        submenu.classList.remove('pointer-events-none');
                        submenu.style.display = 'block';
                        button.setAttribute('aria-expanded', 'true');
                    } else {
                        submenu.classList.add('opacity-0');
                        submenu.classList.add('pointer-events-none');
                        submenu.style.display = '';
                        button.setAttribute('aria-expanded', 'false');
                    }
                }
            });
        });
        
        // Cerrar submenús al hacer clic fuera
        document.addEventListener('click', (e) => {
            // Si el clic no fue dentro de un submenú o un botón de submenú
            if (!e.target.closest('[id^="submenu-"]') && !e.target.closest('.modern-nav > div.relative.group > button')) {
                closeAllSubmenus();
            }
        });
    } else {
        // Para escritorio, eliminar cualquier estilo inline que pueda interferir con el hover
        document.querySelectorAll('[id^="submenu-"]').forEach(submenu => {
            submenu.style.display = '';
            submenu.style.opacity = '';
            submenu.style.pointerEvents = '';
        });
    }

    // Verificar y cargar el PDF correctamente
    const pdfIframe = document.querySelector('iframe[src$=".pdf"]');
    if (pdfIframe) {
        // Verificar si el PDF carga correctamente
        pdfIframe.onerror = function() {
            console.error('Error al cargar el PDF');
            // Mostrar mensaje de error
            const parent = pdfIframe.parentNode;
            const errorMsg = document.createElement('div');
            errorMsg.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4';
            errorMsg.innerHTML = '<strong>Error:</strong> No se pudo cargar el PDF. Por favor, <a href="../Documents/Anuario 2024 OMO.pdf" download class="underline">descárguelo directamente</a>.';
            parent.appendChild(errorMsg);
        };

        // Intentar con una URL absoluta si la relativa falla
        pdfIframe.onload = function() {
            console.log('PDF cargado correctamente');
        };
    }

    // Función para verificar si un elemento existe en el DOM
    function elementExists(selector) {
        return document.querySelector(selector) !== null;
    }

    // Verificar si el PDF existe y cargarlo correctamente
    if (elementExists('iframe[src$=".pdf"]') && !elementExists('.pdf-fallback')) {
        const pdfContainer = document.querySelector('iframe[src$=".pdf"]').parentNode;
        
        // Crear un enlace de respaldo por si falla la carga del PDF
        const pdfFallback = document.createElement('div');
        pdfFallback.className = 'pdf-fallback mt-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative';
        pdfFallback.innerHTML = `
            <p class="font-medium">¿Problemas para ver el PDF?</p>
            <p>Prueba estas opciones:</p>
            <ul class="list-disc pl-5 mt-2">
                <li><a href="../Documents/Anuario 2024 OMO.pdf" download class="underline">Descargar el PDF</a></li>
                <li><a href="../Documents/Anuario 2024 OMO.pdf" target="_blank" class="underline">Abrir en una nueva pestaña</a></li>
            </ul>
        `;
        pdfContainer.appendChild(pdfFallback);
    }
});