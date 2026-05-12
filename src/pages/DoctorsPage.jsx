import React, { useState, useEffect } from 'react';
import { 
  UserPlus, Search, Filter, MoreVertical, X, CheckCircle, 
  Clock, Activity, Phone, Shield, Calendar, ChevronRight, 
  Trash2, Edit2, UserCheck, Check, Users, Plus
} from 'lucide-react';
import doctorsData from '../data/doctors.json';
import patientsData from '../data/patients.json';

// --- SUB-COMPONENTS --- //

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up z-50">
      <CheckCircle size={20} className="text-green-400" />
      <span className="font-medium text-sm">{message}</span>
      <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg ml-2 transition">
        <X size={16} />
      </button>
    </div>
  );
};

const DoctorDrawer = ({ doctor, isOpen, onClose, onAssign }) => {
  if (!isOpen || !doctor) return null;

  const initials = doctor.fullName.replace('Dr. ', '').split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}>
        
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-white flex justify-between items-start">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold border-2 border-white/40">
              {initials}
            </div>
            <div>
              <h2 className="text-xl font-bold">{doctor.fullName}</h2>
              <p className="text-indigo-200 font-medium">{doctor.specialization}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-slate-500 text-xs font-bold uppercase mb-1">Experience</p>
              <p className="text-lg font-bold text-slate-800">{doctor.experience} Yrs</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-slate-500 text-xs font-bold uppercase mb-1">Assigned</p>
              <p className="text-lg font-bold text-slate-800">{doctor.assignedPatients} Patients</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Phone size={18} className="text-slate-400" /> Contact Info
            </h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-200 last:border-0">
                <span className="text-slate-500">Phone Code</span>
                <span className="font-medium text-slate-800">+91</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 last:border-0">
                <span className="text-slate-500">Number</span>
                <span className="font-medium text-slate-800">{doctor.phone.replace('+91 ', '')}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 last:border-0">
                <span className="text-slate-500">Email</span>
                <span className="font-medium text-slate-800">{doctor.fullName.toLowerCase().replace(/[^a-z]/g, '')}@softcare.com</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Activity size={18} className="text-slate-400" /> Today's Schedule
              </h3>
              <button 
                onClick={() => onAssign(doctor)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Plus size={14} /> Assign
              </button>
            </div>
            
            <div className="space-y-3">
              {[
                { time: '09:00 AM', task: 'Ward Rounds', type: 'routine' },
                { time: '11:30 AM', task: 'Follow-up (Room 102)', type: 'patient' },
                { time: '02:00 PM', task: 'Surgery Prep', type: 'critical' },
              ].map((slot, i) => (
                <div key={i} className="flex gap-4 items-start pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="text-xs font-bold text-slate-500 w-16 pt-1">{slot.time}</div>
                  <div className="flex-1">
                    <div className={`p-3 rounded-lg border text-sm font-medium ${
                      slot.type === 'critical' ? 'bg-red-50 border-red-100 text-red-700' :
                      slot.type === 'patient' ? 'bg-indigo-50 border-indigo-100 text-indigo-700' :
                      'bg-slate-50 border-slate-200 text-slate-700'
                    }`}>
                      {slot.task}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const AddDoctorModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    fullName: '', specialization: 'General Physician', experience: '', phone: '', availability: 'Available'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        fullName: '', specialization: 'General Physician', experience: '', phone: '', availability: 'Available'
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSave({
        ...formData,
        doctorId: initialData ? initialData.doctorId : `DOC${Math.floor(Math.random() * 1000)}`,
        assignedPatients: initialData ? initialData.assignedPatients : 0,
        fullName: formData.fullName.startsWith('Dr.') ? formData.fullName : `Dr. ${formData.fullName}`
      });
      setLoading(false);
      onClose();
    }, 600);
  };


  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <UserPlus size={20} className="text-indigo-600"/> Add New Doctor
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition"><X size={20}/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
              <input required type="text" placeholder="e.g. Ramesh Gupta" 
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Specialization</label>
                <select 
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:border-indigo-500 outline-none transition bg-white"
                  value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})}
                >
                  <option>Cardiologist</option>
                  <option>Neurologist</option>
                  <option>General Physician</option>
                  <option>Orthopedic</option>
                  <option>Pediatrician</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Experience (Years)</label>
                <input required type="number" min="0" 
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:border-indigo-500 outline-none transition"
                  value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                <input required type="text" placeholder="+91 9876543210" 
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:border-indigo-500 outline-none transition"
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Initial Status</label>
                <select 
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:border-indigo-500 outline-none transition bg-white"
                  value={formData.availability} onChange={e => setFormData({...formData, availability: e.target.value})}
                >
                  <option>Available</option>
                  <option>In Surgery</option>
                  <option>On Leave</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition flex items-center gap-2">
              {loading ? <Clock size={16} className="animate-spin" /> : <Check size={16} />} 
              {loading ? 'Saving...' : 'Save Doctor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AssignPatientModal = ({ isOpen, onClose, doctor, onAssign }) => {
  const [patientId, setPatientId] = useState('');
  const [time, setTime] = useState('10:00 AM');
  
  if (!isOpen || !doctor) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if(patientId) {
      onAssign(doctor.doctorId, patientId, time);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-indigo-50">
          <div>
            <h2 className="text-lg font-bold text-indigo-900">Assign Patient</h2>
            <p className="text-xs text-indigo-700 font-medium">To {doctor.fullName}</p>
          </div>
          <button onClick={onClose} className="p-2 text-indigo-400 hover:text-indigo-600 rounded-lg transition"><X size={20}/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Patient</label>
              <select required className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:border-indigo-500 outline-none bg-white"
                value={patientId} onChange={e => setPatientId(e.target.value)}>
                <option value="">-- Choose Patient --</option>
                {patientsData.map(p => (
                  <option key={p.patientId} value={p.patientId}>{p.fullName} ({p.patientId})</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Time Slot</label>
              <select className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:border-indigo-500 outline-none bg-white"
                value={time} onChange={e => setTime(e.target.value)}>
                <option>09:00 AM</option> <option>10:00 AM</option> <option>11:30 AM</option>
                <option>02:00 PM</option> <option>04:00 PM</option> <option>06:30 PM</option>
              </select>
            </div>
          </div>
          
          <div className="mt-8 flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition">Cancel</button>
            <button type="submit" disabled={!patientId} className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition disabled:opacity-50">Confirm</button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- MAIN COMPONENT --- //

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  
  // Modal States
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [assignDoctorTarget, setAssignDoctorTarget] = useState(null);
  const [toastMsg, setToastMsg] = useState('');


  // Fetch doctors on mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await fetch('/api/doctors');
      const data = await res.json();
      setDoctors(data);
    } catch (e) {
      console.error("Fetch Error:", e);
    }
  };


  // Derived KPI Data
  const totalDocs = doctors.length;
  const availDocs = doctors.filter(d => d.availability === 'Available').length;
  const busyDocs = doctors.filter(d => ['In Surgery', 'Busy'].includes(d.availability)).length;
  const offDocs = totalDocs - availDocs - busyDocs;

  // Filtering & Sorting
  let processedDoctors = doctors.filter(d => {
    const matchSearch = d.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || d.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filterStatus === 'All' ? true : 
                        filterStatus === 'Busy' ? ['In Surgery', 'Busy'].includes(d.availability) :
                        filterStatus === 'Available' ? d.availability === 'Available' :
                        !['Available', 'In Surgery', 'Busy'].includes(d.availability);
    return matchSearch && matchFilter;
  });

  if (sortBy === 'experience') {
    processedDoctors.sort((a,b) => b.experience - a.experience);
  } else {
    processedDoctors.sort((a,b) => a.fullName.localeCompare(b.fullName));
  }

  // Handlers
  const handleOpenDrawer = (doc) => {
    setSelectedDoctor(doc);
    setIsDrawerOpen(true);
  };

  const handleSaveDoctor = async (newDoc) => {
    try {
      const url = isEditMode ? `/api/doctors/${newDoc.doctorId}` : '/api/doctors';
      const method = isEditMode ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDoc)
      });

      if (res.ok) {
        fetchDoctors();
        setToastMsg(isEditMode ? `Dr. ${newDoc.fullName} updated.` : `Dr. ${newDoc.fullName} added.`);
        setIsAddOpen(false);
      }
    } catch (e) {
      console.error("Save Error:", e);
    }
  };

  const handleEditDoctor = (e, doc) => {
    e.stopPropagation();
    setSelectedDoctor(doc);
    setIsEditMode(true);
    setIsAddOpen(true);
  };

  const handleDeleteDoctor = async (e, id) => {
    e.stopPropagation();
    if(window.confirm("Are you sure you want to remove this doctor from the system?")) {
      try {
        const res = await fetch(`/api/doctors/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchDoctors();
          setToastMsg('Doctor removed from system.');
          if (selectedDoctor?.doctorId === id) setIsDrawerOpen(false);
        }
      } catch (e) {
        console.error("Delete Error:", e);
      }
    }
  };


  const handleAssignPatient = (doctorId, patientId, time) => {
    setDoctors(doctors.map(d => 
      d.doctorId === doctorId ? { ...d, assignedPatients: (d.assignedPatients || 0) + 1 } : d
    ));
    setToastMsg(`Patient ${patientId} assigned to slot ${time}.`);
  };

  return (
    <div className="pb-10">
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <UserPlus className="text-indigo-600" size={32} /> Doctor Management
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Manage hospital staff, specializations, and availability schedules.</p>
        </div>
        <button 
          onClick={() => setIsAddOpen(true)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 hover:scale-105 hover:shadow-lg transition-all flex items-center gap-2 font-bold shadow-indigo-200 shadow-md">
          <Plus size={20} /> Add Doctor
        </button>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div><p className="text-slate-500 font-bold text-xs uppercase mb-1">Total</p><p className="text-2xl font-bold text-slate-800">{totalDocs}</p></div>
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500"><Shield size={20}/></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div><p className="text-green-600 font-bold text-xs uppercase mb-1">Available</p><p className="text-2xl font-bold text-slate-800">{availDocs}</p></div>
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600"><CheckCircle size={20}/></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div><p className="text-amber-600 font-bold text-xs uppercase mb-1">Busy / Surgery</p><p className="text-2xl font-bold text-slate-800">{busyDocs}</p></div>
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600"><Activity size={20}/></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div><p className="text-slate-500 font-bold text-xs uppercase mb-1">Off Duty</p><p className="text-2xl font-bold text-slate-800">{offDocs}</p></div>
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500"><Clock size={20}/></div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row gap-4 justify-between items-center">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-3 text-slate-400" size={18} />
            <input 
              type="text" placeholder="Search name or specialization..." 
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-4 py-2.5 border-none outline-none rounded-xl text-sm w-full bg-white shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 transition-shadow"
            />
          </div>
          
          <div className="flex space-x-3 w-full lg:w-auto">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white border-none shadow-sm ring-1 ring-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="All">All Statuses</option>
              <option value="Available">Available Only</option>
              <option value="Busy">Busy / In Surgery</option>
              <option value="Off Duty">Off Duty</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border-none shadow-sm ring-1 ring-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="name">Sort by Name</option>
              <option value="experience">Sort by Experience</option>
            </select>
          </div>
        </div>

        {/* Dynamic Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="p-5">Doctor Info</th>
                <th className="p-5">Experience</th>
                <th className="p-5">Contact</th>
                <th className="p-5">Status</th>
                <th className="p-5">Patients</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {processedDoctors.map(doctor => (
                <tr 
                  key={doctor.doctorId} 
                  onClick={() => handleOpenDrawer(doctor)}
                  className="hover:bg-indigo-50/40 transition-colors cursor-pointer group"
                >
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                        {doctor.fullName.replace('Dr. ', '').split(' ').map(n=>n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{doctor.fullName}</div>
                        <div className="text-sm font-medium text-slate-500">{doctor.specialization}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 text-slate-700 font-medium">
                    {doctor.experience} Years
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                      <Phone size={14} className="text-slate-400" /> {doctor.phone}
                    </div>
                  </td>
                  <td className="p-5">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold border flex w-max items-center gap-1.5 ${
                        doctor.availability === 'Available' ? 'bg-green-50 text-green-700 border-green-200' : 
                        ['In Surgery', 'Busy'].includes(doctor.availability) ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                        'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        doctor.availability === 'Available' ? 'bg-green-500' : 
                        ['In Surgery', 'Busy'].includes(doctor.availability) ? 'bg-amber-500' : 'bg-slate-400'
                      }`} />
                      {doctor.availability}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-50 border border-slate-100 text-slate-700 text-sm font-bold">
                      <Users size={14} className="text-indigo-400"/> {doctor.assignedPatients || 0}
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setAssignDoctorTarget(doctor); }}
                        className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition" title="Assign Patient">
                        <UserCheck size={18} />
                      </button>
                      <button 
                        onClick={(e) => handleEditDoctor(e, doctor)}
                        className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition" title="Edit Doctor">
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={(e) => handleDeleteDoctor(e, doctor.doctorId)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete">
                        <Trash2 size={18} />
                      </button>
                      <ChevronRight size={20} className="text-slate-300 ml-2" />
                    </div>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {processedDoctors.length === 0 && (
            <div className="py-16 text-center text-slate-500">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
                <Search size={24} className="text-slate-400" />
              </div>
              <p className="font-medium text-lg text-slate-800 mb-1">No doctors found</p>
              <p>Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>

      <DoctorDrawer 
        isOpen={isDrawerOpen} 
        doctor={selectedDoctor} 
        onClose={() => setIsDrawerOpen(false)} 
        onAssign={(doc) => setAssignDoctorTarget(doc)}
      />
      
      <AddDoctorModal 
        isOpen={isAddOpen} 
        initialData={isEditMode ? selectedDoctor : null}
        onClose={() => { setIsAddOpen(false); setIsEditMode(false); }} 
        onSave={handleSaveDoctor} 
      />


      <AssignPatientModal 
        isOpen={!!assignDoctorTarget} 
        doctor={assignDoctorTarget} 
        onClose={() => setAssignDoctorTarget(null)} 
        onAssign={handleAssignPatient} 
      />
    </div>
  );
}
