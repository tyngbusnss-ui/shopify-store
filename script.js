// ======== STATE MANAGEMENT ========
let cart = [];
let currentPage = 'home-page';

// Load cart from localStorage
function loadCart() {
    const saved = localStorage.getItem('phlox-cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartUI();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('phlox-cart', JSON.stringify(cart));
}

// ======== NAVIGATION ========
function navigateTo(page) {
    // Hide current page
    const currentPageElement = document.getElementById(currentPage);
    if (currentPageElement) {
        currentPageElement.style.display = 'none';
    }

    // Show new page
    const newPageElement = document.getElementById(page);
    if (newPageElement) {
        newPageElement.style.display = 'block';
    }

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[data-page="${page.replace('-page', '')}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    currentPage = page;
    window.scrollTo(0, 0);
}

// ======== SEARCH MODAL ========
function toggleSearch() {
    const modal = document.getElementById('searchModal');
    modal.classList.toggle('active');
}

// Close search modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('searchModal');
    const searchBtn = document.querySelector('.btn-search');
    
    if (!modal.contains(e.target) && !searchBtn.contains(e.target)) {
        modal.classList.remove('active');
    }
});

// ======== CART MANAGEMENT ========
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    sidebar.classList.toggle('active');
}

function addToCart(productName, price) {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: Date.now(),
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    
    // Show notification
    showNotification(`${productName} added to cart!`);
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartUI();
}

function updateCartQuantity(itemId, newQuantity) {
    const item = cart.find(item => item.id === itemId);
    if (item && newQuantity > 0) {
        item.quantity = newQuantity;
        saveCart();
        updateCartUI();
    }
}

function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items display
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = '$0.00';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid #e8e8e8;">
                <div>
                    <h4 style="margin-bottom: 0.3rem;">${item.name}</h4>
                    <p style="color: #ff6b6b; font-weight: 600;">$${item.price}</p>
                </div>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                    <button onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})" style="padding: 4px 8px; background: #f5f5f5; border: none; border-radius: 6px; cursor: pointer;">-</button>
                    <span style="min-width: 30px; text-align: center;">${item.quantity}</span>
                    <button onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})" style="padding: 4px 8px; background: #f5f5f5; border: none; border-radius: 6px; cursor: pointer;">+</button>
                    <button onclick="removeFromCart(${item.id})" style="padding: 4px 8px; background: #ffe6e6; color: #ff6b6b; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">×</button>
                </div>
            </div>
        `).join('');
        
        // Calculate total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
}

// ======== NOTIFICATIONS ========
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4ecca3;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ======== NAVIGATION LINKS ========
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.getAttribute('data-page') + '-page';
        navigateTo(page);
    });
});

// ======== SCROLL TO SHOP ========
function scrollToShop() {
    navigateTo('shop-page');
}

// ======== FORM HANDLING ========
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Message sent successfully! We\'ll get back to you soon.');
        form.reset();
    });
});

// ======== ANIMATIONS ========
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .page {
        animation: fadeIn 0.3s ease;
    }
`;
document.head.appendChild(style);

// ======== MOBILE MENU ========
function createMobileMenu() {
    if (window.innerWidth <= 768) {
        const nav = document.querySelector('.nav-menu');
        if (nav && !document.querySelector('.mobile-menu-btn')) {
            const mobileBtn = document.createElement('button');
            mobileBtn.className = 'mobile-menu-btn';
            mobileBtn.innerHTML = '☰';
            mobileBtn.style.cssText = `
                display: none;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #2c3e50;
            `;
            
            if (window.innerWidth <= 768) {
                mobileBtn.style.display = 'block';
                nav.parentElement.insertBefore(mobileBtn, nav);
            }
        }
    }
}

// ======== INITIALIZE ========
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    
    // Set home page as active on load
    navigateTo('home-page');
    
    // Initialize mobile menu
    createMobileMenu();
    window.addEventListener('resize', createMobileMenu);
});

// ======== PRODUCT FILTERS (SHOP PAGE) ========
document.querySelectorAll('.sort-select').forEach(select => {
    select.addEventListener('change', (e) => {
        console.log('Sorting by:', e.target.value);
        // Sorting logic can be implemented here
    });
});

document.querySelectorAll('.filter-options input').forEach(input => {
    input.addEventListener('change', () => {
        console.log('Filters updated');
        // Filter logic can be implemented here
    });
});

// ======== PRICE SLIDER ========
const priceSliders = document.querySelectorAll('.price-slider');
priceSliders.forEach(slider => {
    slider.addEventListener('input', (e) => {
        const display = e.target.parentElement.querySelector('.price-display');
        if (display) {
            display.textContent = `$0 - $${e.target.value}`;
        }
    });
});

// ======== QUICK VIEW ========
document.querySelectorAll('.btn-quick-view').forEach(btn => {
    btn.addEventListener('click', () => {
        showNotification('Quick view feature coming soon!');
    });
});

// ======== EXPAND FAQ ITEMS ========
document.querySelectorAll('.faq-item').forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
        item.style.background = item.style.background === 'rgb(245, 245, 245)' ? 
            'rgb(255, 255, 255)' : 'rgb(245, 245, 245)';
    });
});

// ======== SMOOTH SCROLL LINKS ========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#home' || href === '#shop' || 
            href === '#about' || href === '#reviews' || href === '#contact') {
            e.preventDefault();
            const page = href.substring(1) + '-page';
            navigateTo(page);
        }
    });
});

// ======== CLOSE CART ON OUTSIDE CLICK ========
document.addEventListener('click', (e) => {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartBtn = document.querySelector('.btn-cart');
    
    if (!cartSidebar.contains(e.target) && !cartBtn.contains(e.target)) {
        cartSidebar.classList.remove('active');
    }
});

// ======== ADD TO CART FROM SHOP PAGE ========
document.querySelectorAll('.shop-grid .btn-add-cart').forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('.product-card');
        const name = card.querySelector('.product-name').textContent;
        const price = parseInt(card.querySelector('.product-price').textContent.replace('$', ''));
        addToCart(name, price);
    });
});

// ======== PROFILE BUTTON ========
document.querySelector('.btn-profile').addEventListener('click', () => {
    showNotification('Login feature coming soon! Ready to enhance your experience.');
});

// ======== CHECKOUT BUTTON ========
document.querySelector('.btn-checkout').addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
    } else {
        showNotification('Checkout feature coming soon! Order secure system ready.');
    }
});

// ======== NEWSLETTER SUBSCRIPTION ========
document.querySelectorAll('.newsletter-form button').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const input = btn.previousElementSibling;
        if (input && input.value) {
            showNotification('Successfully subscribed to our newsletter!');
            input.value = '';
        }
    });
});

// ======== INITIAL SETUP ========
// Ensure first page is visible
window.addEventListener('load', () => {
    const homePage = document.getElementById('home-page');
    if (homePage) {
        homePage.style.display = 'block';
    }
});

// ======== KEYBOARD SHORTCUTS ========
document.addEventListener('keydown', (e) => {
    // Ctrl+K or Cmd+K to open search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleSearch();
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        document.getElementById('searchModal').classList.remove('active');
        document.getElementById('cartSidebar').classList.remove('active');
    }
});

// ======== LAZY LOADING IMAGES ========
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img').forEach(img => {
        imageObserver.observe(img);
    });
}

// ======== PRODUCT CARD INTERACTIONS ========
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// ======== DYNAMIC CURRENCY SUPPORT ========
window.currencySymbol = '$';
window.exchangeRate = 1;

function setCurrency(symbol, rate = 1) {
    window.currencySymbol = symbol;
    window.exchangeRate = rate;
    updateCartUI();
}

// ======== UTILITY FUNCTIONS ========
function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function getCartItemCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveCart();
        updateCartUI();
        showNotification('Cart cleared!');
    }
}

// ======== ANALYTICS (OPTIONAL) ========
function trackPageView(pageName) {
    console.log(`Viewed: ${pageName}`);
    // Can be connected to analytics service like Google Analytics
}

function trackAddToCart(productName, price) {
    console.log(`Added to cart: ${productName} - $${price}`);
    // Can be connected to analytics service
}

// Update tracking when navigating
const originalNavigateTo = navigateTo;
window.navigateTo = function(page) {
    originalNavigateTo(page);
    trackPageView(page);
};

// ======== ERROR HANDLING ========
window.addEventListener('error', (event) => {
    console.error('An error occurred:', event.error);
    // In production, send to error tracking service
});

// ======== FEATURE FLAGS ========
const features = {
    enableWishlist: true,
    enableProductReviews: true,
    enableLiveChat: false,
    enablePaymentMethods: ['credit_card', 'paypal', 'apple_pay']
};

// ======== STORAGE FUNCTIONS ========
function saveUserPreferences(preferences) {
    localStorage.setItem('phlox-preferences', JSON.stringify(preferences));
}

function getUserPreferences() {
    const saved = localStorage.getItem('phlox-preferences');
    return saved ? JSON.parse(saved) : {};
}

// ======== ADVANCED SEARCH ========
function searchProducts(query) {
    const products = document.querySelectorAll('.product-card');
    let results = 0;
    
    products.forEach(card => {
        const name = card.querySelector('.product-name').textContent.toLowerCase();
        if (name.includes(query.toLowerCase())) {
            card.style.display = 'block';
            results++;
        } else {
            card.style.display = 'none';
        }
    });
    
    return results;
}

// Connect search input
document.querySelectorAll('.search-input').forEach(input => {
    input.addEventListener('input', (e) => {
        const results = searchProducts(e.target.value);
        if (e.target.value && results === 0) {
            showNotification('No products found matching your search.');
        }
    });
});

// ======== EXPORT FUNCTIONS FOR GLOBAL USE ========
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.toggleCart = toggleCart;
window.toggleSearch = toggleSearch;
window.navigateTo = navigateTo;
window.scrollToShop = scrollToShop;
window.showNotification = showNotification;
window.clearCart = clearCart;
window.getCartTotal = getCartTotal;
window.getCartItemCount = getCartItemCount;
window.setCurrency = setCurrency;
window.searchProducts = searchProducts;
