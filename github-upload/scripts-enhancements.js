console.log('scripts-enhancements.js loaded');
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired');
    // 3D tilt effect for feature cards in Programa Académico section
    const featureCards = document.querySelectorAll('.feature-card-improved');
    featureCards.forEach(card => {
        card.style.transition = 'transform 0.3s ease';
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top;  // y position within the element
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            const rotateX = deltaY * 8; // max 8 degrees rotation
            const rotateY = deltaX * -8;
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
        });
    });

    // Back to top button functionality
    const backToTopBtn = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.remove('hidden');
        } else {
            backToTopBtn.classList.add('hidden');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.querySelector('.modern-nav');

    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', () => {
            const isHidden = mainNav.classList.contains('hidden');
            mainNav.classList.toggle('hidden');
            mobileMenuBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
            console.log('Mobile menu toggled. Now hidden:', !isHidden);
        });
    } else {
        console.warn('Mobile menu button or main navigation not found.');
    }

    // Footer links open main menu and scroll to section
    const footerMenuLinks = document.querySelectorAll('.footer-menu-link');

    if (footerMenuLinks.length === 0) {
        console.warn('No footer menu links found with class "footer-menu-link".');
    }

    footerMenuLinks.forEach(button => {
        button.addEventListener('click', () => {
            console.log('Footer link clicked:', button);
            const targetId = button.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            console.log('Target ID:', targetId, 'Target Element:', targetElement);

            if (!targetElement) {
                console.error('Target element not found for ID:', targetId);
                return;
            }

            // Open main menu if hidden (mobile) by simulating click on mobileMenuBtn
            if (mainNav.classList.contains('hidden') && mobileMenuBtn) {
                console.log('Main nav is hidden, clicking mobile menu button');
                mobileMenuBtn.click();
            }

            // Scroll to target section smoothly
            targetElement.scrollIntoView({ behavior: 'smooth' });
        });
    });
});
