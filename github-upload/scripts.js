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
        if (scrollLeftBtn) {
            scrollLeftBtn.addEventListener('click', () => {
                newsContainer.scrollBy({
                    left: -300,
                    behavior: 'smooth'
                });
            });
        }

        if (scrollRightBtn) {
            scrollRightBtn.addEventListener('click', () => {
                newsContainer.scrollBy({
                    left: 300,
                    behavior: 'smooth'
                });
            });
        }
    }
});
