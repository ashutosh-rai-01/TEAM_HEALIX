const API_URL = 'http://localhost:8888/api';

// Cart State is now handled by CartManager in cart-manager.js
let allMeds = []; // keep a master copy for filtering

async function loadMedicines() {
    const grid = document.getElementById('medicine-grid');
    if(!grid) return;
    grid.innerHTML = '<div class="skeleton-loader"></div><div class="skeleton-loader"></div><div class="skeleton-loader"></div>';
    
    try {
        const response = await fetch(`${API_URL}/medicines`);
        allMeds = await response.json();
        renderMeds(allMeds);
    } catch (err) {
        grid.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:#dc2626; padding:80px; font-weight:600;">⚠️ Could not connect to backend (port 8888). Please start the server.</p>';
    }
}

function renderMeds(meds) {
    const grid = document.getElementById('medicine-grid');
    if(!grid) return;
    grid.innerHTML = '';
    
    meds.forEach(async med => {
        const discount = med.discount || Math.floor(Math.random() * 15) + 5; 
        const mrp = med.originalPrice || (med.price * (1 + discount/100)).toFixed(2);
        
        const imgUrl = med.image || `https://via.placeholder.com/150?text=${encodeURIComponent(med.name)}`;
        
        const card = document.createElement('div');
        card.className = 'apollo-card';
        card.innerHTML = `
            <div class="product-badge">${discount}% OFF</div>
            <div class="med-image-container">
                <img src="${imgUrl}" alt="${med.name}" class="med-img" onerror="this.src='https://via.placeholder.com/150?text=Medicine'">
            </div>
            <div class="med-info">
                <h3>${med.name}</h3>
                <div class="card-meta">${med.category || 'General'} Special Care • Pharmacy</div>
                
                <div class="price-row">
                    <div class="mrp-strike">MRP ₹${mrp}</div>
                    <div class="final-price">
                        <span class="cost">₹${med.price.toFixed(2)}</span>
                        <button class="apollo-add-btn" onclick="CartManager.addItem({id: '${med.id || med._id}', name: '${med.name.replace(/'/g, "")}', price: ${med.price}, image: '${imgUrl}'})">
                            ADD
                        </button>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
    
    if(typeof lucide !== 'undefined') lucide.createIcons();
}

function updateCartBadge() {
    if(window.CartManager) CartManager.updateUI();
}

function setCategory(cat) {
  window.location.href = `category.html?type=${cat.toLowerCase()}`;
}

window.onload = () => {
    loadMedicines();
    updateCartBadge();
};

function filterMeds() {
    const query = document.getElementById('search-med').value.trim().toLowerCase();
    if(!query) { renderMeds(allMeds); return; }
    const filtered = allMeds.filter(m =>
        m.name.toLowerCase().includes(query) ||
        (m.category && m.category.toLowerCase().includes(query))
    );
    renderMeds(filtered.length > 0 ? filtered : allMeds);
}


