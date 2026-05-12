const API_URL = 'http://localhost:8888/api'; // From our backend fix earlier

// 1. READ URL PARAMS
const params = new URLSearchParams(window.location.search);
const categoryType = params.get("type");

// Map category types to display names
const categoryNames = {
    'diabetes': 'Diabetes Care Essentials',
    'cardiac': 'Heart & Cardiac Wellness',
    'stomach': 'Stomach & Digestive Care',
    'pain': 'Pain & Fever Relief',
    'cold': 'Cold, Cough & Immunity',
    'vitamins': 'Vitamins & Nutrition'
};

// 2. GOOGLE IMAGE FETCH LOGIC (DYNAMIC)
async function getMedImage(medName, category) {
    // Note: You can add your Real Google API_KEY and CX here later.
    // For now, I've implemented the structure that fetches dynamically.
    const API_KEY = 'YOUR_GOOGLE_API_KEY';
    const CX = 'YOUR_CUSTOM_SEARCH_ENGINE_ID';
    
    try {
        const query = encodeURIComponent(`${medName} medicine pharmacy`);
        const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${query}&searchType=image&num=1`;
        
        // Dynamic fetch attempt
        const response = await fetch(searchUrl);
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            return data.items[0].link; // Real Google Image Link
        }
    } catch (err) {
        console.warn("Google API failed or Key missing. Using your defined Fallback.");
    }
    
    // ⚙️ FALLBACK: Your requested via.placeholder.com link
    return `https://via.placeholder.com/150?text=${encodeURIComponent(medName)}`;
}

// 3. LOAD DATA
async function loadCategoryMeds() {
    const grid = document.getElementById('category-grid');
    const title = document.getElementById('category-title');
    const countDisplay = document.getElementById('results-count');

    title.innerText = categoryNames[categoryType] || 'Health Essentials';

    try {
        const res = await fetch(`${API_URL}/medicines?category=${categoryType}`);
        const meds = await res.json();
        
        if (meds.length === 0) {
            grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:100px;">
                <i data-lucide="package-search" style="width:64px; height:64px; opacity:0.5; margin-bottom:20px"></i>
                <h2>No Medicines found in this category yet.</h2>
                <a href="pharmacy.html" style="color:var(--apollo-green); font-weight:600">Explore Store</a>
            </div>`;
            countDisplay.innerText = "0 products found";
        } else {
            grid.innerHTML = '';
            countDisplay.innerText = `Showing ${meds.length} products for you`;

            for(const med of meds) {
                // Prioritize backend image, then category default, then placeholder
                const imgUrl = med.image || await getMedImage(med.name, med.category);
                const discount = Math.floor(Math.random() * 15) + 5;
                const mrp = (med.price * (1 + discount/100)).toFixed(2);

                const card = document.createElement('div');
                card.className = 'apollo-card';
                card.innerHTML = `
                    <div class="product-badge">${discount}% OFF</div>
                    <div class="med-image-container">
                        <img src="${imgUrl}" alt="${med.name}" class="med-img" onerror="this.src='https://via.placeholder.com/400?text=Medicine'">
                    </div>
                    <div class="med-info" style="padding: 1.5rem;">
                        <h3 style="font-size: 1rem; font-weight: 600; color: #334155; height: 48px; overflow: hidden; margin-bottom: 0.5rem;">${med.name}</h3>
                        <div class="card-meta" style="color:#94a3b8; font-size: 0.8rem; margin-bottom: 1rem;">${med.category} • Health Specialist</div>
                        <div class="price-row" style="display: flex; align-items: baseline; gap: 10px; margin-bottom: 1.5rem;">
                            <div class="final-price" style="font-size: 1.25rem; font-weight: 700; color: #1e293b;">₹${med.price.toFixed(2)}</div>
                            <div class="mrp-strike" style="font-size: 0.9rem; text-decoration: line-through; color: #94a3b8;">₹${mrp}</div>
                        </div>
                        <button class="apollo-add-btn" 
                                onclick="addToCart('${med.id || med._id}', '${med.name.replace(/'/g, "")}', ${med.price})"
                                style="width:100%; padding: 12px; font-weight: 700; border-radius: 8px;">
                            ADD TO CART
                        </button>
                    </div>
                `;
                grid.appendChild(card);
            }
        }
        if(typeof lucide !== 'undefined') lucide.createIcons();
    } catch (err) {
        grid.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:red; padding:100px">Backend Connection Error: Port 8888 not responding!</p>`;
    }
}

// 4. CART LOGIC
function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('healix_cart')) || [];
    const existing = cart.find(i => i.id === id);
    if(existing) {
        existing.qty++;
    } else {
        cart.push({id, name, price, qty: 1});
    }
    localStorage.setItem('healix_cart', JSON.stringify(cart));
    
    // Smooth cart update
    document.querySelectorAll('.cart-count').forEach(b => {
        b.innerText = cart.reduce((sum, i) => sum + i.qty, 0);
        b.style.transform = 'scale(1.3)';
        setTimeout(() => b.style.transform = 'scale(1)', 200);
    });
    
    // Quick success toast (browser native)
    alert("Medicine added to your HEALIX cart! 🩺🛒");
}

// Initialize
window.onload = loadCategoryMeds;
