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
    const icon = mobileToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.mobile-menu-links a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    });
});

// Menu Tab Filtering
const menuTabs = document.querySelectorAll('.menu-tab');
const menuItems = document.querySelectorAll('.menu-item');

menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Update active tab
        menuTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Filter items
        const target = tab.getAttribute('data-target');
        menuItems.forEach(item => {
            if (item.classList.contains(target)) {
                item.style.display = 'flex';
                item.style.animation = 'fadeIn 0.5s ease forwards';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Animation for menu items
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// Simple Scroll Reveal
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('section > .container').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s ease-out';
    observer.observe(el);
});
// Contact Form Submission
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            // Hide form and show success message
            contactForm.style.display = 'none';
            formSuccess.style.display = 'block';

            // Log submission (for simulation purposes)
            const formData = new FormData(contactForm);
            console.log('Form Submitted:', Object.fromEntries(formData));
        }, 1500);
    });
}
// --- Ordering System (Swiggy-like) ---
let cart = [];

const cartIconBtn = document.getElementById('cart-icon-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartCountBadge = document.querySelector('.cart-count');
const cartTotalAmount = document.getElementById('cart-total-amount');
const checkoutBtn = document.getElementById('checkout-btn');

// Toggle Cart Sidebar
const toggleCart = () => {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
};

if (cartIconBtn) cartIconBtn.addEventListener('click', toggleCart);
if (closeCart) closeCart.addEventListener('click', toggleCart);
if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);

// Add to Cart Logic
document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const menuItem = btn.closest('.menu-item');
        const id = menuItem.getAttribute('data-id');
        const name = menuItem.getAttribute('data-name');
        const price = parseFloat(menuItem.getAttribute('data-price'));

        addItemToCart(id, name, price);

        // Visual feedback on button
        const originalText = btn.textContent;
        btn.textContent = 'Added!';
        btn.style.backgroundColor = '#16a34a'; // Green
        btn.style.borderColor = '#16a34a';
        btn.style.color = '#fff';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = '';
            btn.style.borderColor = '';
            btn.style.color = '';
        }, 1000);
    });
});

const addItemToCart = (id, name, price) => {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    updateCartUI();
};

const updateCartUI = () => {
    // Update badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountBadge.textContent = totalItems;

    // Update Items List
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your basket is empty</div>';
        checkoutBtn.disabled = true;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>$${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn minus" onclick="changeQuantity('${item.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn plus" onclick="changeQuantity('${item.id}', 1)">+</button>
                </div>
            </div>
        `).join('');
        checkoutBtn.disabled = false;
    }

    // Update Total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalAmount.textContent = `$${total.toFixed(2)}`;
};

// Global function for quantity buttons (called from inline onclick)
window.changeQuantity = (id, delta) => {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += delta;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        updateCartUI();
    }
};

// --- Checkout Flow Logic ---
const checkoutSection = document.getElementById('checkout');
const orderForm = document.getElementById('order-form');
const backToMenuBtn = document.getElementById('back-to-menu');
const checkoutSummaryDetails = document.getElementById('checkout-summary-details');

const orderSuccessModal = document.getElementById('order-success-modal');
const closeSuccessModal = document.getElementById('close-success-modal');
const modalOrderSummary = document.getElementById('modal-order-summary');

const showCheckout = () => {
    // Show checkout section
    checkoutSection.style.display = 'block';

    // Update checkout summary
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const summaryHTML = `
        <h4>Order Summary</h4>
        ${cart.map(item => `
            <div class="summary-item">
                <span>${item.quantity}x ${item.name}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('')}
        <div class="summary-total">
            <span>Total Amount</span>
            <span>$${total.toFixed(2)}</span>
        </div>
    `;
    checkoutSummaryDetails.innerHTML = summaryHTML;

    // Scroll to checkout
    checkoutSection.scrollIntoView({ behavior: 'smooth' });
};

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        toggleCart(); // Close sidebar
        showCheckout();
    });
}

if (backToMenuBtn) {
    backToMenuBtn.addEventListener('click', () => {
        checkoutSection.style.display = 'none';
        window.location.hash = 'menu';
    });
}

// Order Form Submission
if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
        // Prepare cart data for backend
        const hiddenCartItems = document.getElementById('hidden-cart-items');
        const hiddenCartTotal = document.getElementById('hidden-cart-total');

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Pass cart items as JSON and total as number
        hiddenCartItems.value = JSON.serialize ? JSON.serialize(cart) : JSON.stringify(cart);
        hiddenCartTotal.value = total.toFixed(2);

        const submitBtn = orderForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Placing Order...';

        // The form will now submit naturally to place_order.php
    });
}

if (closeSuccessModal) {
    closeSuccessModal.addEventListener('click', () => {
        orderSuccessModal.classList.remove('active');
        window.location.hash = 'home';
    });
}
