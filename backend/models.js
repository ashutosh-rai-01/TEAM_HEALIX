import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  patientId: { type: String, unique: true },
  fullName: String,
  age: Number,
  gender: String,
  phone: String,
  email: String,
  address: String,
  disease: String,
  bloodGroup: String,
  allergies: String,
  emergencyContact: String,
  status: { type: String, enum: ['Outpatient', 'Admitted', 'Critical'] },
  bedNumber: String,
  admissionDate: String,
  assignedDoctor: String,
  createdAt: String
});

const doctorSchema = new mongoose.Schema({
  doctorId: { type: String, unique: true },
  fullName: String,
  specialization: { type: String, enum: ['Cardiologist', 'Neurologist', 'General Physician', 'Orthopedic', 'Pediatrician'] },
  experience: Number,
  phone: String,
  availability: String,
  assignedPatients: Number
});

const appointmentSchema = new mongoose.Schema({
  appointmentId: { type: String, unique: true },
  patientId: String,
  patientName: String,
  doctorId: String,
  doctorName: String,
  date: String,
  time: String,
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'] },
  reason: String
});

const bedSchema = new mongoose.Schema({
  bedId: { type: String, unique: true },
  ward: { type: String, enum: ['ICU Ward', 'General Ward'] },
  status: { type: String, enum: ['Available', 'Occupied', 'Maintenance'] },
  assignedPatientId: String
});

const billingSchema = new mongoose.Schema({
  billId: { type: String, unique: true },
  patientId: String,
  patientName: String,
  amount: Number,
  status: { type: String, enum: ['Paid', 'Pending'] },
  services: String,
  date: String
});

export const Patient = mongoose.model('Patient', patientSchema);
export const Doctor = mongoose.model('Doctor', doctorSchema);
export const Appointment = mongoose.model('Appointment', appointmentSchema);
export const Bed = mongoose.model('Bed', bedSchema);
export const Billing = mongoose.model('Billing', billingSchema);
