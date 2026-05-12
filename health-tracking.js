// Constants
const API_BASE = 'http://localhost:5000'; // Target FastAPI backend
const DEVICE_ID = 'demo-user';

let sysChartInstance;
let vitalsChart;
let hrChartInstance;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Generate some mock startup-style UI elements to fulfill visual UX goals
    document.getElementById('mockSteps').innerText = (Math.floor(Math.random() * 5000) + 5000).toLocaleString();
    document.getElementById('mockCals').innerText = (Math.floor(Math.random() * 800) + 1800).toLocaleString();
    
    // Check local storage for theme
    const isNight = localStorage.getItem('theme') === 'night';
    if(isNight) document.body.classList.add('night');

    fetchHistory();
});

// Theme Toggle
function toggleTheme() {
    document.body.classList.toggle('night');
    const mode = document.body.classList.contains('night') ? 'night' : 'day';
    localStorage.setItem('theme', mode);

    // Re-render chart defaults for correct font coloring dynamically
    if (sysChartInstance) sysChartInstance.update();
    if (vitalsChart) vitalsChart.update();
    if (hrChartInstance) hrChartInstance.update();
}

// Fetch Data from app.py
async function fetchHistory() {
    try {
        const res = await fetch(`${API_BASE}/health-history/${DEVICE_ID}`);
        if(!res.ok) throw new Error("Failed to fetch history");
        const data = await res.json();
        
        // Update Chart and Table
        if(data.history && data.history.length > 0) {
            updateDashboard(data.history);
        } else {
            document.getElementById('historyTable').innerHTML = '<tr><td colspan="7">No history found. Try logging some vitals!</td></tr>';
            // Clear chart
            if (sysChartInstance) sysChartInstance.destroy();
            if (vitalsChart) vitalsChart.destroy();
            if (hrChartInstance) hrChartInstance.destroy();
        }
    } catch (err) {
        console.error("Fetch Error: ", err);
        document.getElementById('historyTable').innerHTML = '<tr><td colspan="7">Error loading data. Ensure the backend is running.</td></tr>';
    }
}

// UI Updaters
function updateDashboard(history) {
    // 1. Update Table
    const tbody = document.getElementById('historyTable');
    tbody.innerHTML = '';

    const formatDate = (dateStr) => {
        try {
            const d = new Date(dateStr);
            if(isNaN(d)) return dateStr;
            return d.toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'});
        } catch(e) { return dateStr; }
    };

    history.forEach(entry => {
        const tr = document.createElement('tr');
        
        let riskClass = 'normal';
        let riskText = 'Normal';
        let riskIcon = '';
        if(entry.risk.includes('High')) { riskClass = '#dc2626'; riskText = ' High BP!'; riskIcon = '⚠️'; }
        else if(entry.risk.includes('Moderate')) { riskClass = '#d97706'; riskText = ' High BP!'; riskIcon = '⚠️'; }
        
        let scoreClass = 'cyan';
        let scoreText = `${entry.score} (Normal)`;
        if(entry.score < 80) { scoreClass = 'warning'; scoreText = `${entry.score} (Borderline)`; }
        if(entry.score < 60) { scoreClass = 'danger'; scoreText = `${entry.score} (High Risk)`; }

        tr.innerHTML = `
            <td style="color:var(--text-muted); font-size:13px;">${formatDate(entry.date)}</td>
            <td style="font-weight:600;">${entry.sys}/${entry.dia}</td>
            <td style="font-weight:600;">${entry.sugar} <span style="font-weight:400; color:var(--text-muted); font-size:12px;">(mg/dL)</span></td>
            <td><span style="padding:6px 12px; border-radius:12px; font-size:12px; font-weight:600; background:var(--${scoreClass}-bg); color:var(--${scoreClass});">${scoreText}</span></td>
            <td style="font-size:13px; font-weight:600; color:${riskClass};">${riskIcon}${riskText}</td>
            <td style="font-size:13px; color:var(--text-muted);">${entry.suggestion}</td>
            <td>
                <button style="background:transparent; border:1px solid var(--border); border-radius:4px; padding:4px 6px; cursor:pointer;" onclick="editEntry(${entry.id})"><i data-lucide="edit-2" style="width:14px; color:var(--text-muted)"></i></button>
                <button style="background:transparent; border:1px solid var(--border); border-radius:4px; padding:4px 6px; cursor:pointer; margin-left:4px;" onclick="deleteEntry(${entry.id})"><i data-lucide="trash-2" style="width:14px; color:var(--text-muted)"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    if(window.lucide) window.lucide.createIcons();

    // 2. Update Chart
    // Get last 15 entries & Reverse for chronological order left-to-right
    const chartData = history.slice(0, 15).reverse();
    
    const labels = chartData.map(e => e.date);
    const sysData = chartData.map(e => e.sys);
    const diaData = chartData.map(e => e.dia);

    // Theming ChartJS depending on mode
    const isNight = document.body.classList.contains('night');
    Chart.defaults.color = isNight ? '#94a3b8' : '#64748b';
    Chart.defaults.scale.grid.color = isNight ? '#334155' : '#e2e8f0';
    Chart.defaults.font.family = "'Inter', sans-serif";

    // 1. Sys Chart (Log Vitals panel)
    if (sysChartInstance) sysChartInstance.destroy();
    const ctxSys = document.getElementById('sysChart').getContext('2d');
    sysChartInstance = new Chart(ctxSys, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Systolic',
                data: sysData,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.3, fill: true, borderWidth: 2
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });

    // 2. Health Chart (BP Analytics)
    if (vitalsChart) vitalsChart.destroy();
    const ctxBP = document.getElementById('healthChart').getContext('2d');
    vitalsChart = new Chart(ctxBP, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Systolic',
                    data: sysData,
                    borderColor: '#2563eb', // dark blue
                    backgroundColor: 'transparent',
                    tension: 0.3, fill: false, borderWidth: 2
                },
                {
                    label: 'Diastolic',
                    data: diaData,
                    borderColor: '#7dd3fc', // light blue
                    backgroundColor: 'transparent',
                    tension: 0.3, fill: false, borderWidth: 2
                }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } } }
    });

    // 3. Heart Rate Chart
    if (hrChartInstance) hrChartInstance.destroy();
    const hrData = chartData.map(e => parseInt(e.hr) || (Math.floor(Math.random() * 20) + 60)); // fallback if no HR returned
    const ctxHR = document.getElementById('hrChart').getContext('2d');
    hrChartInstance = new Chart(ctxHR, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Heart Rate',
                data: hrData,
                borderColor: '#ec4899', // pink color
                backgroundColor: 'rgba(236, 72, 153, 0.1)',
                tension: 0.3, fill: true, borderWidth: 2
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'top' } } }
    });
}

// POST new vitals
async function saveVitals() {
    const age = parseInt(document.getElementById('ageIn').value) || 30;
    const gender = document.getElementById('genderIn').value || "Male";
    const height = parseInt(document.getElementById('heightIn').value) || 175;
    const weight = parseInt(document.getElementById('weightIn').value) || 70;
    const sys = parseInt(document.getElementById('sysIn').value);
    const dia = parseInt(document.getElementById('diaIn').value);
    const sugar = parseInt(document.getElementById('sugarIn').value);
    const hr = parseInt(document.getElementById('hrIn').value);
    const spo2 = parseInt(document.getElementById('spo2In').value);
    const temp = parseFloat(document.getElementById('tempIn').value);
    
    // Parse symptoms
    const symInput = document.getElementById('symptomsIn').value || "";
    const symptoms = symInput.split(',').map(s => s.trim()).filter(s => s.length > 0);

    // Validate
    if(!sys || !dia || !sugar || !hr || !spo2 || !temp) {
        alert("Please fill in all vitals to get an accurate Health Index score.");
        return;
    }

    // Pydantic Expected Payload matches app.py HealthData schema
    const payload = {
        device_id: DEVICE_ID,
        age: age,
        gender: gender,
        height: height,
        weight: weight,
        hr: hr,
        sys: sys,
        dia: dia,
        sugar: sugar,
        temp: temp,
        spo2: spo2,
        symptoms: symptoms, 
        duration: symptoms.length > 0 ? "recent" : "None"
    };

    try {
        const res = await fetch(`${API_BASE}/health-data`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if(res.ok) {
            // Clear fields on success
            document.querySelectorAll('.input-group input').forEach(el => el.value = '');
            // Close the modal
            document.getElementById('vitalsModal').style.display='none';
            // Reload history to see the new backend AI prediction score
            fetchHistory();
        } else {
            const err = await res.json();
            console.log("Validation Error:", err);
            alert("Error saving data: Check your vital formats.");
        }

    } catch(err) {
        console.error(err);
        alert("Network Error: Could not reach the backend at " + API_BASE);
    }
}

// Delete Entry
async function deleteEntry(entryId) {
    if(!confirm("Are you sure you want to delete this vital log?")) return;
    
    try {
        const res = await fetch(`${API_BASE}/health-entry/${entryId}`, { method: 'DELETE' });
        if(res.ok) fetchHistory();
    } catch(err) {
        console.error(err);
    }
}
