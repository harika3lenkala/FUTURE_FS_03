// Sticky Navbar
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('sticky');
    } else {
        navbar.classList.remove('sticky');
    }
});

// Mobile Menu Toggle
const mobileToggle = document.getElementById('mobile-toggle');
const mobileMenu = document.getElementById('mobile-menu');

mobileToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');

    // Animate hamburger to X
    const spans = mobileToggle.querySelectorAll('span');
    spans[0].style.transform = mobileMenu.classList.contains('active') ? 'rotate(45deg) translate(6px, 6px)' : 'none';
    spans[1].style.opacity = mobileMenu.classList.contains('active') ? '0' : '1';
    spans[2].style.transform = mobileMenu.classList.contains('active') ? 'rotate(-45deg) translate(5px, -5px)' : 'none';
});

// Close mobile menu when link is clicked
const mobileLinks = mobileMenu.querySelectorAll('a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        // Reset hamburger
        const spans = mobileToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Basic Scroll Reveal Logic
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, observerOptions);

// Select elements for reveal
document.querySelectorAll('.section-title, .service-card, .gallery-item, .about-image, .contact-info, .glass-form').forEach(el => {
    el.classList.add('reveal-on-scroll');
    observer.observe(el);
});

// Add these styles dynamically for reveal
const style = document.createElement('style');
style.textContent = `
    .reveal-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .revealed {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Form Handling
const bookingForm = document.getElementById('aura-booking-form');
if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = bookingForm.querySelector('button');
        const originalText = btn.textContent;

        btn.textContent = 'Seeking Balance...';
        btn.disabled = true;

        setTimeout(() => {
            alert('Your journey to wellness has begun. We will contact you shortly to confirm your session.');
            btn.textContent = originalText;
            btn.disabled = false;
            bookingForm.reset();
        }, 2000);
    });
}
