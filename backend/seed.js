import mongoose from 'mongoose';
import fs from 'fs/promises';
import { Patient, Doctor, Appointment, Bed, Billing } from './models.js';

// Load from .env if present, else fallback
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Healix';

async function seedDatabase() {
  try {
    console.log(`Connecting to MongoDB at ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    // Clear existing data
    console.log('Clearing existing hospital collections...');
    await Patient.deleteMany({});
    await Doctor.deleteMany({});
    await Appointment.deleteMany({});
    await Bed.deleteMany({});
    await Billing.deleteMany({});

    // Read JSON files
    console.log('Reading generated JSON datasets...');
    const patientsData = JSON.parse(await fs.readFile('./src/data/patients.json', 'utf-8'));
    const doctorsData = JSON.parse(await fs.readFile('./src/data/doctors.json', 'utf-8'));
    const apptsData = JSON.parse(await fs.readFile('./src/data/appointments.json', 'utf-8'));
    const bedsData = JSON.parse(await fs.readFile('./src/data/beds.json', 'utf-8'));
    const billingData = JSON.parse(await fs.readFile('./src/data/billing.json', 'utf-8'));

    // Insert data into DB
    console.log('Seeding Database...');
    await Patient.insertMany(patientsData);
    await Doctor.insertMany(doctorsData);
    await Appointment.insertMany(apptsData);
    await Bed.insertMany(bedsData);
    await Billing.insertMany(billingData);

    console.log('✅ Success! Hospital Database seeded with realistic data.');
    console.log(`- ${patientsData.length} Patients inserted`);
    console.log(`- ${doctorsData.length} Doctors inserted`);
    console.log(`- ${apptsData.length} Appointments inserted`);
    console.log(`- ${bedsData.length} Beds inserted`);
    console.log(`- ${billingData.length} Billing records inserted`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
