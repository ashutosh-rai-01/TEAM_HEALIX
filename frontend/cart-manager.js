
const CartManager = {
    getCart: () => JSON.parse(localStorage.getItem('healix_cart')) || [],
    
    saveCart: (cart) => {
        localStorage.setItem('healix_cart', JSON.stringify(cart));
        CartManager.updateUI();
    },

    addItem: (product) => {
        let cart = CartManager.getCart();
        const existing = cart.find(item => item.id === (product.id || product.name));
        if (existing) {
            existing.quantity = (existing.quantity || 1) + 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        CartManager.saveCart(cart);
        CartManager.showToast(`✅ ${product.name} added to cart!`);
    },

    updateUI: () => {
        const cartCountEl = document.getElementById('cart-count');
        if (cartCountEl) {
            const totalItems = CartManager.getCart().length;
            cartCountEl.innerText = totalItems;
            cartCountEl.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    },

    showToast: (msg) => {
        let toast = document.getElementById('global-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'global-toast';
            toast.style.cssText = `
                position: fixed; bottom: 30px; right: 30px; background: #0F172A; color: white;
                padding: 12px 24px; border-radius: 12px; z-index: 9999; 
                box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); font-family: 'Inter', sans-serif;
                transition: all 0.3s ease; opacity: 0; transform: translateY(20px);
                display: none;
            `;
            document.body.appendChild(toast);
        }
        toast.innerText = msg;
        toast.style.display = 'block';
        setTimeout(() => { 
            toast.style.opacity = '1'; 
            toast.style.transform = 'translateY(0)'; 
        }, 10);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => { toast.style.display = 'none'; }, 300);
        }, 3000);
    }
};

// Auto-update count on load
document.addEventListener('DOMContentLoaded', () => {
    CartManager.updateUI();
    if (window.lucide) window.lucide.createIcons();
});
