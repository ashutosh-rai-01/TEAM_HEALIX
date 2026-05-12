from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, FileResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
import sqlite3
import json
from pydantic import BaseModel
from typing import Optional, List
import datetime
import os
from pymongo import MongoClient
from dotenv import load_dotenv, find_dotenv
from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv(find_dotenv())

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DATABASE CONFIG ---
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = "healix_db"

try:
    # Set a 5-second timeout so the app doesn't hang if Mongo isn't ready
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    db = client[DB_NAME]
    # Test connection
    client.admin.command('ping')
    print("✅ Connected to MongoDB Atlas Cloud Database!")
except Exception as e:
    print(f"⚠️ MongoDB connection failed: {e}")
    print("🔹 Note: Falling back to local CSV/JSON/SQLite storage.")
    db = None


# Data Paths (Seed/Fallback)
DATA_DIR = os.path.join("src", "data")


def read_json_data(filename):
    path = os.path.join(DATA_DIR, filename)
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error reading {filename}: {e}")
        return []

def write_json_data(filename, data):
    path = os.path.join(DATA_DIR, filename)
    try:
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        return True
    except Exception as e:
        print(f"Error writing {filename}: {e}")
        return False


# SQLite Database setup
DB_PATH = "softcare.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS health_checks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            device_id TEXT,
            age INTEGER,
            gender TEXT,
            height INTEGER,
            weight INTEGER,
            hr INTEGER,
            sys INTEGER,
            dia INTEGER,
            sugar INTEGER,
            temp REAL,
            symptoms TEXT,
            duration TEXT,
            score INTEGER,
            risk TEXT,
            suggestion TEXT,
            dept TEXT,
            spo2 INTEGER,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS mood_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            device_id TEXT,
            mood_label TEXT,
            mood_score INTEGER,
            note TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reminders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            device_id TEXT,
            task TEXT,
            time TEXT,
            type TEXT,
            completed BOOLEAN DEFAULT 0,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# Pydantic models for request bodies
class HealthData(BaseModel):
    device_id: str
    age: int
    gender: str
    height: int
    weight: int
    hr: int
    sys: int
    dia: int
    sugar: int
    temp: float
    spo2: int
    symptoms: List[str]
    duration: str

class MoodData(BaseModel):
    device_id: str
    mood_label: str
    mood_score: int
    note: Optional[str] = ""

class ReminderData(BaseModel):
    device_id: str
    task: str
    time: str
    type: str # 'medication' or 'checkup'

# API Routes
@app.post("/health-data")
def save_health(data: HealthData):
    score = 100
    
    # Vitals Scoring logic (Extended)
    if "Fever" in data.symptoms: score -= 10
    if "Chest Pain" in data.symptoms: score -= 30
    if data.sys > 140 or data.dia > 90: score -= 20
    if data.sugar > 180: score -= 20
    if data.hr < 60 or data.hr > 100: score -= 10
    if data.temp > 38: score -= 10
    if data.spo2 < 95: score -= 15
    if data.spo2 < 90: score -= 25 # Critical O2
    
    score = max(0, score)
    
    # Risk Level
    risk = "Normal"
    if score < 50: risk = "High Risk"
    elif score < 80: risk = "Moderate Risk"

    # Department Selection
    if "Chest Pain" in data.symptoms or data.sys > 160: dept = "Cardiology"
    elif data.sugar > 200: dept = "Endocrinology"
    elif data.temp > 38.5: dept = "Internal Medicine"
    else: dept = "General Physician"

    # Suggestion Logic
    if score < 50: suggestion = "Immediate hospitalization or ER visit recommended."
    elif score < 80: suggestion = "Consult a specialist within 24-48 hours."
    else: suggestion = "Maintain healthy habits and routine checkups."

    # Mock AI Prescription
    ai_rx = []
    if "Fever" in data.symptoms: ai_rx.append("Paracetamol 500mg (SOS)")
    if "Chest Pain" in data.symptoms: ai_rx.append("Aspirin 75mg (Emergency Use Only)")
    if data.sys > 150: ai_rx.append("Amlodipine 5mg (Consult Cardiologist)")
    if data.sugar > 200: ai_rx.append("Metformin 500mg (Consult Diabetologist)")
    if data.spo2 < 92: ai_rx.append("Oxygen Therapy (Immediate)")
    
    ai_rx_str = ", ".join(ai_rx) if ai_rx else "No acute medication recommended."

    # --- SAVE LOGIC (MONGODB FIRST, SQLITE SECOND) ---
    health_entry = {
        "device_id": data.device_id,
        "age": data.age,
        "gender": data.gender,
        "height": data.height,
        "weight": data.weight,
        "hr": data.hr,
        "sys": data.sys,
        "dia": data.dia,
        "sugar": data.sugar,
        "temp": data.temp,
        "symptoms": data.symptoms,
        "duration": data.duration,
        "score": score,
        "risk": risk,
        "suggestion": suggestion,
        "dept": dept,
        "spo2": data.spo2,
        "timestamp": datetime.datetime.now().isoformat()
    }

    if db is not None:
        try:
            db.health_checks.insert_one(health_entry)
        except Exception as e:
            print(f"Mongo Save Error: {e}")

    # Legacy SQLite Save (Internal fallback)
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO health_checks 
            (device_id, age, gender, height, weight, hr, sys, dia, sugar, temp, symptoms, duration, score, risk, suggestion, dept, spo2)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data.device_id, data.age, data.gender, data.height, data.weight, 
            data.hr, data.sys, data.dia, data.sugar, data.temp, 
            ",".join(data.symptoms), data.duration, score, risk, suggestion, dept, data.spo2
        ))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"SQLite Save Error: {e}")

    return {
        "success": True,
        "score": score,
        "risk": risk,
        "suggestion": suggestion,
        "dept": dept,
        "ai_prescription": ai_rx_str
    }


# --- MOOD LOGS & REMINDERS API ---
@app.post("/mood-log")
def log_mood(data: MoodData):
    entry = {**data.dict(), "timestamp": datetime.datetime.now().isoformat()}
    if db is not None:
        db.mood_logs.insert_one(entry)
    
    # SQLite Backup
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO mood_logs (device_id, mood_label, mood_score, note) VALUES (?, ?, ?, ?)", 
                   (data.device_id, data.mood_label, data.mood_score, data.note))
    conn.commit()
    conn.close()
    return {"success": True}

@app.get("/mood-history/{device_id}")
def get_mood_history(device_id: str):
    if db is not None:
        history = list(db.mood_logs.find({"device_id": device_id}).sort("timestamp", -1).limit(30))
        for h in history: h["_id"] = str(h["_id"])
        return {"history": history}
    
    # Fallback to SQLite
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM mood_logs WHERE device_id = ? ORDER BY timestamp DESC LIMIT 30", (device_id,))
    rows = cursor.fetchall()
    conn.close()
    return {"history": [dict(r) for r in rows]}


@app.post("/reminder")
def add_reminder(data: ReminderData):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO reminders (device_id, task, time, type) VALUES (?, ?, ?, ?)", 
                   (data.device_id, data.task, data.time, data.type))
    conn.commit()
    conn.close()
    return {"success": True}

@app.get("/reminders/{device_id}")
def get_reminders(device_id: str):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM reminders WHERE device_id = ? AND completed = 0 ORDER BY time ASC", (device_id,))
    rows = cursor.fetchall()
    conn.close()
    return {"reminders": [dict(r) for r in rows]}

@app.delete("/reminder/{rem_id}")
def delete_reminder(rem_id: int):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM reminders WHERE id = ?", (rem_id,))
    conn.commit()
    conn.close()
    return {"success": True}

# --- 50 FAKE DOCTORS DATA ---
DOCTORS = [
    {"id": i, "name": f"Dr. {name}", "specialty": spec, "exp": exp, "rating": 4.5 + (i % 5) / 10, "fees": 500 + (i * 10)}
    for i, (name, spec, exp) in enumerate([
        ("Arjun Mehta", "Cardiology", "15 years"), ("Sanya Iyer", "Neurology", "10 years"), 
        ("Rohan Sharma", "Orthopedics", "12 years"), ("Ananya Gupta", "Pediatrics", "8 years"),
        ("Vikram Singh", "Dermatology", "20 years"), ("Priya Das", "Gastroenterology", "11 years"),
        ("Kabir Khan", "Psychiatry", "14 years"), ("Ishani Roy", "Ophthalmology", "9 years"),
        ("Amitabh Bose", "Oncology", "18 years"), ("Sneha Patil", "Urology", "7 years"),
        ("Rahul Verma", "Endocrinology", "13 years"), ("Zara Sheikh", "ENT", "10 years"),
        ("Kunal Sen", "Nephrology", "16 years"), ("Ritu Malik", "Gynecology", "15 years"),
        ("Sahil Kapur", "Pulmonology", "12 years"), ("Tanya Bajaj", "Dentistry", "8 years"),
        ("Abhay Joshi", "Rheumatology", "19 years"), ("Mansi Negi", "Hematology", "11 years"),
        ("Neil D'Souza", "General Physician", "14 years"), ("Pooja Hegde", "Plastic Surgery", "9 years"),
        ("Varun Dhawan", "Cardiology", "11 years"), ("Alia Bhatt", "Neurology", "15 years"),
        ("Ranbir Kapoor", "Orthopedics", "12 years"), ("Deepika Padukone", "Pediatrics", "18 years"),
        ("Hrithik Roshan", "Dermatology", "14 years"), ("Katrina Kaif", "Gastroenterology", "9 years"),
        ("Akshay Kumar", "Psychiatry", "22 years"), ("Kareena Kapoor", "Ophthalmology", "16 years"),
        ("Salman Khan", "Oncology", "19 years"), ("Priyanka Chopra", "Urology", "13 years"),
        ("Aamir Khan", "Endocrinology", "17 years"), ("Anushka Sharma", "ENT", "11 years"),
        ("Vicky Kaushal", "Nephrology", "8 years"), ("Janhavi Kapoor", "Gynecology", "10 years"),
        ("Kartik Aaryan", "Pulmonology", "9 years"), ("Sara Ali Khan", "Dentistry", "7 years"),
        ("Ayushmann Khurrana", "Rheumatology", "14 years"), ("Taapsee Pannu", "Hematology", "12 years"),
        ("Rajkummar Rao", "General Physician", "13 years"), ("Bhumi Pednekar", "Plastic Surgery", "11 years"),
        ("Shah Rukh Khan", "Cardiology", "25 years"), ("Madhuri Dixit", "Neurology", "20 years"),
        ("Amitabh Bachchan", "Orthopedics", "35 years"), ("Tabu", "Pediatrics", "22 years"),
        ("Irrfan Khan", "Dermatology", "30 years"), ("Vidya Balan", "Gastroenterology", "18 years"),
        ("Naseeruddin Shah", "Psychiatry", "40 years"), ("Shabana Azmi", "Ophthalmology", "38 years"),
        ("Pankaj Tripathi", "Oncology", "15 years"), ("Radhika Apte", "Urology", "12 years")
    ])
]

@app.get("/doctors")
def get_doctors_api():
    return DOCTORS

# --- DOCTOR PORTAL BACKEND MIGRATION ---

@app.get("/api/doctor/stats")
def get_doctor_stats():
    if db is not None:
        try:
            total_patients = db.patients.count_documents({})
            emergency = db.patients.count_documents({"status": "Critical"})
            return {
                "totalPatients": total_patients,
                "todayAppointments": 8, # Mocked
                "pendingReports": 5,
                "emergencyCases": emergency
            }
        except: pass

    # Fallback JSON logic
    patients = read_json_data('patients.json')
    appointments = read_json_data('appointments.json')
    stats = {
        "totalPatients": len(patients),
        "todayAppointments": 8,
        "pendingReports": 5,
        "emergencyCases": len([p for p in patients if p.get('status') == 'Critical'])
    }
    return stats


@app.get("/api/doctor/patients")
def get_doctor_patients():
    return read_json_data('patients.json')

@app.post("/api/doctor/patients")
def create_doctor_patient(data: dict):
    patients = read_json_data('patients.json')
    new_patient = {
        "patientId": f"PAT{1000 + len(patients) + 1}",
        **data,
        "createdAt": datetime.datetime.now().isoformat()
    }
    patients.append(new_patient)
    write_json_data('patients.json', patients)
    return new_patient

@app.get("/api/doctor/appointments")
def get_doctor_appointments():
    return read_json_data('appointments.json')

@app.put("/api/doctor/appointments/{app_id}")
def update_doctor_appointment(app_id: str, data: dict):
    appointments = read_json_data('appointments.json')
    for i, appt in enumerate(appointments):
        if appt.get('id') == app_id or appt.get('appointmentId') == app_id:
            appointments[i].update(data)
            write_json_data('appointments.json', appointments)
            return appointments[i]
    raise HTTPException(status_code=404, detail="Appointment not found")

@app.get("/api/doctor/emergencies")
def get_doctor_emergencies():
    patients = read_json_data('patients.json')
    return [p for p in patients if p.get('status') == 'Critical']

# --- DOCTOR MANAGEMENT API (ADMIN PORTAL) ---

@app.get("/api/doctors")
def get_all_doctors():
    if db is not None:
        docs = list(db.doctors.find({}))
        for d in docs: d["_id"] = str(d["_id"])
        return docs
    return read_json_data('doctors.json')

@app.post("/api/doctors")
async def add_doctor(doctor: dict):
    if db is not None:
        # Generate a display ID if not present
        if "doctorId" not in doctor:
            doctor["doctorId"] = f"DOC{datetime.datetime.now().strftime('%M%S')}"
        result = db.doctors.insert_one(doctor)
        doctor["_id"] = str(result.inserted_id)
        return doctor
    # Fallback to JSON
    doctors = read_json_data('doctors.json')
    doctors.append(doctor)
    write_json_data('doctors.json', doctors)
    return doctor

@app.put("/api/doctors/{doc_id}")
async def update_doctor(doc_id: str, doctor: dict):
    if db is not None:
        # Support both MongoDB _id and doctorId field
        query = {"doctorId": doc_id} if not doc_id.startswith("6") else {"_id": ObjectId(doc_id)}
        if "_id" in doctor: del doctor["_id"]
        db.doctors.update_one(query, {"$set": doctor})
        return {"success": True}
    return {"success": False}

@app.delete("/api/doctors/{doc_id}")
async def delete_doctor(doc_id: str):
    if db is not None:
        query = {"doctorId": doc_id} if not doc_id.startswith("6") else {"_id": ObjectId(doc_id)}
        db.doctors.delete_one(query)
        return {"success": True}
    return {"success": False}


# --- PHARMACY MODULE API ---

@app.get("/api/pharmacy/inventory")
def get_inventory():
    inventory = read_json_data('inventory.json')
    if not inventory:
        # Seed initial data
        inventory = [
            {"id": "MED001", "name": "Paracetamol 500mg", "stock": 150, "price": 10.5, "expiry": "2026-12-31", "supplier": "Generic Pharma", "category": "Painkiller"},
            {"id": "MED002", "name": "Cetirizine 10mg", "stock": 80, "price": 5.0, "expiry": "2025-06-30", "supplier": "Cipla Ltd", "category": "Antihistamine"},
            {"id": "MED003", "name": "Amoxicillin 250mg", "stock": 20, "price": 45.0, "expiry": "2025-09-15", "supplier": "Sun Pharma", "category": "Antibiotic"},
            {"id": "MED004", "name": "Metformin 500mg", "stock": 200, "price": 15.0, "expiry": "2027-01-10", "supplier": "Generic Pharma", "category": "Antidiabetic"}
        ]
        write_json_data('inventory.json', inventory)
    return inventory

@app.post("/api/pharmacy/inventory")
def add_medicine(medicine: dict):
    inventory = read_json_data('inventory.json')
    medicine["id"] = f"MED{100 + len(inventory) + 1}"
    inventory.append(medicine)
    write_json_data('inventory.json', inventory)
    return medicine

@app.put("/api/pharmacy/inventory/{med_id}")
def update_medicine(med_id: str, medicine: dict):
    inventory = read_json_data('inventory.json')
    for i, med in enumerate(inventory):
        if med.get('id') == med_id:
            inventory[i].update(medicine)
            write_json_data('inventory.json', inventory)
            return inventory[i]
    raise HTTPException(status_code=404, detail="Medicine not found")

@app.delete("/api/pharmacy/inventory/{med_id}")
def delete_medicine(med_id: str):
    inventory = read_json_data('inventory.json')
    inventory = [m for m in inventory if m.get('id') != med_id]
    write_json_data('inventory.json', inventory)
    return {"success": True}

@app.get("/api/pharmacy/prescriptions")
def get_pharmacy_prescriptions():
    prescriptions = read_json_data('prescriptions.json')
    if not prescriptions:
        # Seed initial data
        prescriptions = [
            {"id": "RX1001", "patientName": "Aarav Sharma", "medicines": ["Paracetamol 500mg (1-0-1)", "Cetirizine 10mg (0-0-1)"], "status": "Pending", "date": datetime.datetime.now().strftime('%Y-%m-%d')},
            {"id": "RX1002", "patientName": "Ishita Roy", "medicines": ["Amoxicillin 250mg (1-1-1)"], "status": "Pending", "date": datetime.datetime.now().strftime('%Y-%m-%d')}
        ]
        write_json_data('prescriptions.json', prescriptions)
    return prescriptions

@app.put("/api/pharmacy/prescriptions/{rx_id}")
def update_prescription_status(rx_id: str, data: dict):
    prescriptions = read_json_data('prescriptions.json')
    for i, rx in enumerate(prescriptions):
        if rx.get('id') == rx_id:
            prescriptions[i]["status"] = data.get("status", "Dispensed")
            write_json_data('prescriptions.json', prescriptions)
            return prescriptions[i]
    raise HTTPException(status_code=404, detail="Prescription not found")

@app.post("/api/pharmacy/bills")
def create_bill(bill: dict):
    bills = read_json_data('pharmacy_bills.json')
    bill["id"] = f"BILL{1000 + len(bills) + 1}"
    bill["timestamp"] = datetime.datetime.now().isoformat()
    bills.append(bill)
    write_json_data('pharmacy_bills.json', bills)
    
    # Update inventory stock
    inventory = read_json_data('inventory.json')
    for item in bill.get("items", []):
        for med in inventory:
            if med["name"] == item["name"]:
                med["stock"] -= item["quantity"]
    write_json_data('inventory.json', inventory)
    
    return bill

@app.get("/api/pharmacy/bills")
def get_bills():
    return read_json_data('pharmacy_bills.json')

# --- END OF PHARMACY API ---

# --- DELIVERY LOCATION API ---

@app.post("/api/location")
async def save_location(data: dict):
    """Save user's selected delivery location"""
    city = data.get("city", "")
    state = data.get("state", "")
    if not city:
        raise HTTPException(status_code=400, detail="City is required")
    
    loc_data = {"city": city, "state": state, "savedAt": datetime.datetime.now().isoformat()}
    
    # Save to JSON file for persistence
    try:
        write_json_data("user_location.json", loc_data)
    except Exception:
        pass
    
    return {"success": True, "city": city, "state": state}

@app.get("/api/location")
def get_location():
    """Get saved delivery location"""
    try:
        data = read_json_data("user_location.json")
        if isinstance(data, list):
            return {"city": "", "state": ""}
        return data if data else {"city": "", "state": ""}
    except Exception:
        return {"city": "", "state": ""}




@app.get("/health-history/{device_id}")
def get_history(device_id: str):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM health_checks WHERE device_id = ? ORDER BY timestamp DESC", (device_id,))
    rows = cursor.fetchall()
    conn.close()

    history = []
    for r in rows:
        history.append({
            "id": r["id"],
            "date": r["timestamp"].split(" ")[0] if r["timestamp"] else "N/A",
            "score": r["score"],
            "risk": r["risk"],
            "dept": r["dept"],
            "suggestion": r["suggestion"],
            "sys": r["sys"],
            "dia": r["dia"],
            "sugar": r["sugar"]
        })
    
    trend = "Stable"
    if len(history) >= 2:
        if history[0]["score"] > history[1]["score"]: trend = "Health Improving"
        elif history[0]["score"] < history[1]["score"]: trend = "Health Declining"

    return {"history": history, "trend": trend}

@app.delete("/health-entry/{entry_id}")
def delete_entry(entry_id: int):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM health_checks WHERE id = ?", (entry_id,))
    conn.commit()
    conn.close()
    return {"success": True}

@app.delete("/health-history/{device_id}")
def delete_history(device_id: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM health_checks WHERE device_id = ?", (device_id,))
    conn.commit()
    conn.close()
    return {"success": True}

# Web Routes
@app.get("/", response_class=HTMLResponse)
def serve_index():
    with open("index.html", "r", encoding="utf-8") as f:
        return f.read()

@app.get("/login", response_class=HTMLResponse)
def serve_login():
    with open("login.html", "r", encoding="utf-8") as f:
        return f.read()

@app.get("/admin-dashboard", response_class=HTMLResponse)
def serve_admin_dashboard():
    with open("dashboard.html", "r", encoding="utf-8") as f:
        return f.read()

@app.get("/dashboard", response_class=HTMLResponse)
def serve_dashboard():
    # This serves the static Patient Portal
    with open("pateintportal.html", "r", encoding="utf-8") as f:
        return f.read().replace("{{ user_name }}", "Patient")


@app.get("/health-check")
async def health_check_page():
    return FileResponse("health-check.html")

@app.get("/reports")
async def reports_page():
    return FileResponse("reports.html")

@app.get("/appointments")
async def appointments_page():
    return FileResponse("appointments.html")

@app.get("/reminders-page")
async def reminders_page():
    return FileResponse("reminders.html")

@app.get("/prescriptions")
async def prescriptions_page():
    return FileResponse("prescriptions.html")

@app.get("/pharmacy", response_class=HTMLResponse)
async def pharmacy_page():
    with open("pharmacy.html", "r", encoding="utf-8") as f:
        return f.read()

@app.get("/store", response_class=HTMLResponse)
async def store_page():
    with open(os.path.join("frontend", "pharmacy.html"), "r", encoding="utf-8") as f:
        return f.read()

@app.get("/store/doctors", response_class=HTMLResponse)
async def store_doctors_page():
    with open(os.path.join("frontend", "doctors.html"), "r", encoding="utf-8") as f:
        return f.read()

@app.get("/store/labtests", response_class=HTMLResponse)
async def store_labtests_page():
    with open(os.path.join("frontend", "labtests.html"), "r", encoding="utf-8") as f:
        return f.read()

@app.get("/store/cart", response_class=HTMLResponse)
async def store_cart_page():
    with open(os.path.join("frontend", "cart.html"), "r", encoding="utf-8") as f:
        return f.read()

@app.post("/api/doctor/appointments")
async def book_appointment(data: dict):
    """Book a doctor appointment from the pharmacy frontend"""
    appointments = read_json_data('appointments.json')
    appointment = {
        "id": f"APT{1000 + len(appointments) + 1}",
        "doctor": data.get("doctor", ""),
        "specialty": data.get("specialty", ""),
        "patientName": data.get("patient", ""),
        "phone": data.get("phone", ""),
        "date": data.get("date", ""),
        "time": data.get("time", ""),
        "type": data.get("type", "online"),
        "concern": data.get("concern", ""),
        "fee": data.get("fee", 0),
        "status": "Scheduled",
        "createdAt": datetime.datetime.now().isoformat()
    }
    appointments.append(appointment)
    write_json_data('appointments.json', appointments)
    return {"success": True, "appointmentId": appointment["id"], "message": "Appointment booked successfully"}

@app.get("/bmi-check")

async def bmi_check_page():
    return FileResponse("bmi-check.html")

@app.get("/mood-check")
async def mood_check_page():
    return FileResponse("mood-check.html")

@app.get("/logout")
def serve_logout():
    # Because there's no auth, we just redirect them home gracefully if they smash Logout
    return RedirectResponse(url="/")

@app.get("/appointment-redirect")
@app.get("/appointments-redirect")
def redirect_appointments():
    return RedirectResponse(url="/dashboard#appointments")

@app.get("/report-redirect")
@app.get("/reports-redirect")
def redirect_reports():
    return RedirectResponse(url="/dashboard#reports")


# Mount static files (like style.css)
app.mount("/", StaticFiles(directory="."), name="static")

if __name__ == "__main__":
    import uvicorn
    # Use 0.0.0.0 to listen on all IPv4 interfaces for maximum compatibility
    uvicorn.run("app:app", host="0.0.0.0", port=5000, reload=True)
