import json
import random
import os
from pymongo import MongoClient
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

# Configuration
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = "healix_db"
json_file_path = os.path.join("src", "data", "doctors.json")

first_names = ["Arjun", "Sanya", "Rohan", "Ananya", "Vikram", "Priya", "Kabir", "Ishani", "Amitabh", "Sneha", 
               "Rahul", "Zara", "Kunal", "Ritu", "Sahil", "Tanya", "Abhay", "Mansi", "Neil", "Pooja",
               "Aditya", "Meera", "Varun", "Kavya", "Siddharth", "Aishwarya", "Raj", "Simran", "Deepak", "Swati",
               "Ishaan", "Nandini", "Yash", "Tanvi", "Kartik", "Riya", "Pranav", "Divya", "Manish", "Shreya",
               "Gaurav", "Preeti", "Aman", "Nehal", "Akash", "Bhavna", "Vishal", "Komal", "Saurabh", "Kiran"]

last_names = ["Mehta", "Iyer", "Sharma", "Gupta", "Singh", "Das", "Khan", "Roy", "Bose", "Patil", 
              "Verma", "Sheikh", "Sen", "Malik", "Kapur", "Bajaj", "Joshi", "Negi", "D'Souza", "Hegde",
              "Malhotra", "Pandey", "Chopra", "Deshmukh", "Agrawal", "Trivedi", "Khanna", "Dubey", "Reddy", "Nair",
              "Sarin", "Kohli", "Bansal", "Misra", "Chatterjee", "Mittal", "Saxena", "Sodhi", "Varghese", "Menon"]

specializations = ["Cardiologist", "Neurologist", "Orthopedic", "Pediatrician", "Dermatologist", 
                   "Gastroenterologist", "Psychiatrist", "Ophthalmologist", "Oncologist", "Urologist", 
                   "Endocrinology", "ENT Specialist", "Nephrologist", "Gynecologist", "General Physician"]

def generate_doctors(count=60):
    doctors = []
    used_names = set()
    
    while len(doctors) < count:
        first = random.choice(first_names)
        last = random.choice(last_names)
        full_name = f"Dr. {first} {last}"
        
        if full_name in used_names:
            continue
            
        used_names.add(full_name)
        spec = random.choice(specializations)
        exp = random.randint(3, 35)
        phone = f"+91 {random.randint(70000, 99999)} {random.randint(10000, 99999)}"
        status = random.choice(["Available", "Available", "In Surgery", "On Leave", "Busy"])
        
        doctors.append({
            "doctorId": f"DOC{1000 + len(doctors)}",
            "fullName": full_name,
            "specialization": spec,
            "experience": exp,
            "phone": phone,
            "availability": status,
            "assignedPatients": random.randint(0, 15),
            "email": f"{first.lower()}.{last.lower()}@softcare.com"
        })
    return doctors

def seed():
    doctors_list = generate_doctors(75)
    
    # 1. Update JSON fallback
    try:
        os.makedirs(os.path.dirname(json_file_path), exist_ok=True)
        with open(json_file_path, 'w', encoding='utf-8') as f:
            json.dump(doctors_list, f, indent=2)
        print(f"✅ Successfully seeded {len(doctors_list)} doctors to JSON.")
    except Exception as e:
        print(f"❌ Error seeding JSON: {e}")

    # 2. Update MongoDB
    try:
        client = MongoClient(MONGO_URI)
        db = client[DB_NAME]
        db.doctors.delete_many({}) # Clear existing
        db.doctors.insert_many(doctors_list)
        print(f"✅ Successfully seeded {len(doctors_list)} doctors to MongoDB Atlas.")
    except Exception as e:
        print(f"⚠️ MongoDB seeding skipped: {e}")

if __name__ == "__main__":
    seed()
