/* ============================================================
   HEALIX Location Selector — Full JS Module
   Features: GPS, Search, City Select, localStorage, Backend sync
   ============================================================ */

const CITIES = [
  { name: 'Bhopal',    icon: '🌳', state: 'Madhya Pradesh' },
  { name: 'Delhi',     icon: '🏛️', state: 'Delhi NCR' },
  { name: 'Mumbai',    icon: '🌊', state: 'Maharashtra' },
  { name: 'Bangalore', icon: '🌆', state: 'Karnataka' },
  { name: 'Hyderabad', icon: '💎', state: 'Telangana' },
  { name: 'Chennai',   icon: '🎭', state: 'Tamil Nadu' },
  { name: 'Kolkata',   icon: '🌉', state: 'West Bengal' },
  { name: 'Pune',      icon: '🎓', state: 'Maharashtra' },
  { name: 'Ahmedabad', icon: '🏗️', state: 'Gujarat' },
];

const LOC_API = 'http://localhost:5000/api'; // FastAPI backend (port 5000)

/* ── INJECT MODAL HTML ── */
(function injectModal() {
  const html = `
  <div class="loc-overlay" id="locOverlay" onclick="handleLocOverlayClick(event)">
    <div class="loc-modal" id="locModal">
      <div class="loc-modal-head">
        <div>
          <h3>📍 Select Delivery Location</h3>
          <p>Get medicines delivered to your door</p>
        </div>
        <button class="loc-close-btn" onclick="closeLocModal()">✕</button>
      </div>
      <div class="loc-modal-body">

        <!-- Error -->
        <div class="loc-err" id="locErr"></div>

        <!-- Search -->
        <div class="loc-search-wrap">
          <span style="font-size:18px;">🔍</span>
          <input
            type="text" id="locSearchInput"
            class="loc-search-input"
            placeholder="Search city or area..."
            oninput="handleLocSearch(this.value)"
          >
          <button class="loc-search-clear" id="locSearchClear" onclick="clearLocSearch()">Clear</button>
        </div>

        <!-- Search Results -->
        <div class="loc-results" id="locResults"></div>

        <!-- GPS -->
        <button class="loc-gps-btn" id="locGpsBtn" onclick="detectGPS()">
          <span class="gps-icon">📡</span>
          <div class="spinner-sm"></div>
          <span>Use Current Location</span>
        </button>

        <div class="loc-divider"><span>OR CHOOSE CITY</span></div>

        <div class="loc-cities-label">POPULAR CITIES</div>
        <div class="loc-cities-grid" id="locCitiesGrid"></div>

      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', html);
  renderCities();
  loadSavedLocation();
})();

/* ── RENDER CITY GRID ── */
function renderCities() {
  const grid = document.getElementById('locCitiesGrid');
  if (!grid) return;
  const saved = localStorage.getItem('healix_location') || '';

  grid.innerHTML = CITIES.map(c => `
    <button
      class="loc-city-btn ${c.name === saved ? 'selected' : ''}"
      onclick="selectLocation('${c.name}', '${c.state}', this)"
    >
      <span class="loc-city-icon">${c.icon}</span>
      <span>${c.name}</span>
    </button>
  `).join('');
}

/* ── OPEN / CLOSE ── */
function openLocModal() {
  document.getElementById('locOverlay').classList.add('visible');
  setTimeout(() => document.getElementById('locSearchInput')?.focus(), 300);
}
function closeLocModal() {
  document.getElementById('locOverlay').classList.remove('visible');
}
function handleLocOverlayClick(e) {
  if (e.target === document.getElementById('locOverlay')) closeLocModal();
}

/* ── SEARCH ── */
function handleLocSearch(val) {
  const clear = document.getElementById('locSearchClear');
  const results = document.getElementById('locResults');
  clear.classList.toggle('show', val.length > 0);

  if (!val.trim()) {
    results.classList.remove('show');
    results.innerHTML = '';
    return;
  }

  const q = val.toLowerCase();
  const matches = CITIES.filter(c =>
    c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q)
  );

  if (matches.length === 0) {
    results.innerHTML = `<div style="text-align:center;padding:20px;color:#94A3B8;font-size:14px;">No cities found for "${val}"</div>`;
  } else {
    results.innerHTML = matches.map(c => `
      <div class="loc-result-item" onclick="selectLocation('${c.name}','${c.state}',null)">
        <span class="ri">${c.icon}</span>
        <div>
          <div class="rt">${c.name}</div>
          <div class="rs">${c.state}</div>
        </div>
      </div>
    `).join('');
  }
  results.classList.add('show');
}

function clearLocSearch() {
  document.getElementById('locSearchInput').value = '';
  document.getElementById('locSearchClear').classList.remove('show');
  document.getElementById('locResults').classList.remove('show');
  document.getElementById('locResults').innerHTML = '';
}

/* ── GPS DETECT ── */
async function detectGPS() {
  const btn = document.getElementById('locGpsBtn');
  const err = document.getElementById('locErr');
  err.classList.remove('show');

  if (!navigator.geolocation) {
    showLocError('Geolocation is not supported by your browser.');
    return;
  }

  btn.classList.add('loading');
  btn.disabled = true;

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      try {
        const { latitude: lat, longitude: lon } = pos.coords;
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
        );
        const data = await res.json();
        const city = data.city || data.locality || data.principalSubdivision || `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
        const state = data.principalSubdivision || '';
        selectLocation(city, state, null);
      } catch {
        showLocError('Could not fetch your city name. Please select manually.');
      } finally {
        btn.classList.remove('loading');
        btn.disabled = false;
      }
    },
    (geoErr) => {
      btn.classList.remove('loading');
      btn.disabled = false;
      if (geoErr.code === 1) showLocError('Location access denied. Please allow location permission.');
      else showLocError('Unable to detect location. Please select manually.');
    },
    { timeout: 10000 }
  );
}

function showLocError(msg) {
  const err = document.getElementById('locErr');
  err.innerText = '⚠️ ' + msg;
  err.classList.add('show');
  setTimeout(() => err.classList.remove('show'), 5000);
}

/* ── SELECT LOCATION ── */
function selectLocation(city, state, btnEl) {
  // Save to localStorage
  localStorage.setItem('healix_location', city);
  localStorage.setItem('healix_location_state', state || '');

  // Update all navbar delivery pills on the page
  updateNavbarLocation(city);

  // Highlight city button
  document.querySelectorAll('.loc-city-btn').forEach(b => b.classList.remove('selected'));
  if (btnEl) btnEl.classList.add('selected');

  // Save to backend (non-blocking)
  fetch(`${LOC_API}/location`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ city, state })
  }).catch(() => {}); // silent fail if backend is down

  // Show success toast
  showToast(`📍 Delivering to ${city}!`);

  // Close after short delay so user sees the highlight
  setTimeout(closeLocModal, 600);
}

/* ── UPDATE NAVBAR ── */
function updateNavbarLocation(city) {
  // delivery-pill (pharmacy.html / category.html navbar)
  const pill = document.querySelector('.delivery-pill');
  if (pill) {
    pill.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
      <div>
        <div style="font-size:10px;color:#64748B;font-weight:700;text-transform:uppercase;">Deliver to</div>
        <div style="font-size:14px;font-weight:800;color:#0F172A;" id="navLocText">${city}</div>
      </div>
    `;
    pill.style.cursor = 'pointer';
    pill.onclick = openLocModal;
  }
}

/* ── LOAD SAVED LOCATION ON INIT ── */
function loadSavedLocation() {
  const saved = localStorage.getItem('healix_location');
  if (saved) {
    updateNavbarLocation(saved);
  } else {
    // Try to load from backend
    fetch(`${LOC_API}/location`)
      .then(r => r.json())
      .then(data => {
        if (data && data.city) {
          localStorage.setItem('healix_location', data.city);
          updateNavbarLocation(data.city);
        }
      })
      .catch(() => {}); // silent
  }

  // Make the pill clickable if no location yet
  const pill = document.querySelector('.delivery-pill');
  if (pill && !saved) {
    pill.style.cursor = 'pointer';
    pill.onclick = openLocModal;
  }
}

/* ── TOAST (reuse if already defined) ── */
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.innerText = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

/* ── KEYBOARD ESC CLOSE ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLocModal();
});
