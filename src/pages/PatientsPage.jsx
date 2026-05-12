import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Search, Filter, X, CheckCircle, 
  User, Phone, Activity, Heart, Calendar, 
  Trash2, Edit2, ChevronRight, MoreVertical,
  ArrowRight, FileText, Pill
} from 'lucide-react';
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
    <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up z-[100]">
      <CheckCircle size={20} className="text-green-400" />
      <span className="font-medium text-sm">{message}</span>
      <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg ml-2 transition">
        <X size={16} />
      </button>
    </div>
  );
};

const PatientDrawer = ({ patient, isOpen, onClose }) => {
  if (!isOpen || !patient) return null;

  const initials = patient.fullName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] transition-opacity animate-fade-in" onClick={onClose} />
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}>
        
        {/* Header */}
        <div className={`p-6 text-white flex justify-between items-start ${
          patient.status === 'Critical' ? 'bg-red-600' : 
          patient.status === 'Admitted' ? 'bg-orange-500' : 'bg-blue-600'
        }`}>
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold border-2 border-white/40 shadow-inner">
              {initials}
            </div>
            <div>
              <h2 className="text-xl font-bold leading-tight">{patient.fullName}</h2>
              <p className="text-white/80 text-sm font-medium">{patient.patientId} • {patient.gender}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        {/* Content Tabs Area */}
        <div className="p-6">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Age</p>
              <p className="text-lg font-bold text-slate-800">{patient.age} Years</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Blood Group</p>
              <p className="text-lg font-bold text-red-600">{patient.bloodGroup}</p>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <section>
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Activity size={18} className="text-blue-500" /> Diagnosis Overview
              </h3>
              <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                <p className="text-blue-900 font-semibold">{patient.disease}</p>
                <p className="text-blue-700/70 text-xs mt-1">Last Updated: {new Date().toLocaleDateString()}</p>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Phone size={18} className="text-green-500" /> Contact Details
              </h3>
              <div className="space-y-3 px-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Mobile</span>
                  <span className="font-semibold text-slate-700">{patient.phone}</span>
                </div>
                <div className="flex justify-between items-start text-sm">
                  <span className="text-slate-400">Address</span>
                  <span className="font-semibold text-slate-700 text-right max-w-[200px]">{patient.address}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-100">
                  <span className="text-slate-400">Emergency</span>
                  <span className="font-bold text-red-600">{patient.emergencyContact}</span>
                </div>
              </div>
            </section>

            <section>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <FileText size={18} className="text-purple-500" /> Recent Activity
                </h3>
              </div>
              <div className="space-y-2">
                {[
                  { icon: <Pill size={14}/>, text: 'Vitals checked - Stable', time: '2 hours ago' },
                  { icon: <FileText size={14}/>, text: 'Lab results uploaded', time: 'Yesterday' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 items-center p-3 rounded-xl hover:bg-slate-50 transition cursor-default group">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:shadow-sm transition">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-700">{item.text}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">{item.time}</p>
                    </div>
                    <ChevronRight size={14} className="text-slate-300" />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3 sticky bottom-0">
          <button className="flex-1 bg-white border border-slate-200 py-3 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition shadow-sm">Edit Record</button>
          <button className="flex-1 bg-blue-600 py-3 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition shadow-lg shadow-blue-200">Generate Report</button>
        </div>
      </div>
    </>
  );
};

const AddPatientModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: '', age: '', gender: 'Male', phone: '', disease: '', status: 'Outpatient'
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSave({
        ...formData,
        patientId: `PAT${Math.floor(Math.random() * 1000) + 1000}`,
        bloodGroup: 'B+', // Default for new
        address: 'Mumbai, MH',
        emergencyContact: '+91 91234 56789',
        createdAt: new Date().toISOString()
      });
      setLoading(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-md z-[80] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Plus size={24}/>
            </div>
            Register Patient
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-white hover:shadow-sm transition"><X size={20}/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
            <input required type="text" placeholder="e.g. Aarav Sharma" 
              className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-blue-600 outline-none transition"
              value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Age</label>
              <input required type="number" min="1" max="110" 
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-blue-600 outline-none transition"
                value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Gender</label>
              <select 
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-blue-600 outline-none transition appearance-none cursor-pointer"
                value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}
              >
                <option>Male</option> <option>Female</option> <option>Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Contact Number</label>
            <input required type="tel" placeholder="+91 9XXXX XXXXX" 
              className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-blue-600 outline-none transition"
              value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Diagnosis / Reason</label>
            <input required type="text" placeholder="e.g. Viral Fever" 
              className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-blue-600 outline-none transition"
              value={formData.disease} onChange={e => setFormData({...formData, disease: e.target.value})}
            />
          </div>

          <div className="pt-4 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 text-sm font-bold text-slate-400 hover:text-slate-600 transition">Discard</button>
            <button type="submit" disabled={loading} className="flex-[2] py-4 rounded-2xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : <CheckCircle size={18} />}
              {loading ? 'Registering...' : 'Complete Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- MAIN PAGE --- //

export default function PatientsPage() {
  const [patients, setPatients] = useState(patientsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  // UI States
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);

  // Filter Logic
  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || p.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Handlers
  const openPatient = (patient) => {
    setSelectedPatient(patient);
    setIsDrawerOpen(true);
  };

  const updateStatus = (id, newStatus) => {
    setPatients(patients.map(p => p.patientId === id ? {...p, status: newStatus} : p));
    setToast(`Patient status updated to ${newStatus}`);
    setActiveMenu(null);
  };

  const deletePatient = (id) => {
    if(confirm("Confirm deletion of this medical record?")) {
      setPatients(patients.filter(p => p.patientId !== id));
      setToast("Record permanently removed");
    }
    setActiveMenu(null);
  };

  const savePatient = (newPatient) => {
    setPatients([newPatient, ...patients]);
    setToast(`${newPatient.fullName} registered successfully`);
  };

  return (
    <div className="pb-10 animate-fade-in">
      <Toast message={toast} onClose={() => setToast('')} />

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
             Client Records
          </h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Directory of {patients.length} active hospital profiles</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search registry..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3.5 bg-white border border-slate-100 rounded-2xl text-sm font-semibold w-full md:w-64 focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none shadow-sm transition-all"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-3.5 rounded-2xl hover:bg-blue-700 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-200 transition-all flex items-center gap-2 font-bold text-sm shadow-lg shadow-blue-100"
          >
            <Plus size={18} /> Add Patient
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Status Filters Bar */}
        <div className="p-4 border-b border-slate-50 bg-slate-50/30 flex gap-2">
          {['All', 'Critical', 'Admitted', 'Outpatient'].map(status => (
            <button 
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                filterStatus === status 
                ? 'bg-slate-800 text-white shadow-lg shadow-slate-200 scale-105' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white text-slate-400">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest border-b border-slate-50">Patient Details</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest border-b border-slate-50">Primary Diagnosis</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest border-b border-slate-50">Status Indicator</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest border-b border-slate-50 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPatients.map((p) => {
                const initials = p.fullName.split(' ').map(n => n[0]).join('').toUpperCase();
                const isCritical = p.status === 'Critical';
                
                return (
                  <tr 
                    key={p.patientId} 
                    onClick={() => openPatient(p)}
                    className={`group cursor-pointer transition-all hover:bg-blue-50/30 ${isCritical ? 'bg-red-50/10' : ''}`}
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm transition-transform group-hover:scale-110 ${
                          p.status === 'Critical' ? 'bg-red-100 text-red-600 shadow-red-100' :
                          p.status === 'Admitted' ? 'bg-orange-100 text-orange-600 shadow-orange-100' : 
                          'bg-blue-100 text-blue-600 shadow-blue-100'
                        }`}>
                          {initials}
                        </div>
                        <div>
                          <div className={`font-bold text-slate-800 flex items-center gap-2 ${isCritical ? 'text-red-900 font-black' : ''}`}>
                            {p.fullName} 
                            {isCritical && <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />}
                          </div>
                          <div className="text-xs font-bold text-slate-400 mt-0.5">{p.age}y • {p.patientId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="font-bold text-slate-700 text-sm">{p.disease}</div>
                      <div className="text-xs text-slate-400 mt-1 font-medium">{p.phone}</div>
                    </td>
                    <td className="p-6">
                      <div className="relative inline-block border-l-2 pl-3 border-slate-100">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenu(activeMenu === p.patientId ? null : p.patientId);
                          }}
                          className={`flex items-center gap-2 group/status px-3 py-1.5 rounded-xl transition-all ${
                            p.status === 'Critical' ? 'text-red-700 bg-red-50' : 
                            p.status === 'Admitted' ? 'text-orange-700 bg-orange-50' :
                            'text-emerald-700 bg-emerald-50'
                          }`}
                        >
                          <span className="text-[10px] font-black uppercase tracking-widest">{p.status}</span>
                          <ChevronRight size={14} className={`transition-transform ${activeMenu === p.patientId ? 'rotate-90' : 'group-hover/status:translate-x-0.5'}`} />
                        </button>

                        {/* Status Dropdown */}
                        {activeMenu === p.patientId && (
                          <div className="absolute left-0 top-full mt-2 w-40 bg-slate-900 rounded-2xl shadow-2xl z-50 p-2 border border-white/10 animate-fade-in" onClick={e => e.stopPropagation()}>
                            {['Outpatient', 'Admitted', 'Critical'].map(s => (
                              <button 
                                key={s}
                                onClick={() => updateStatus(p.patientId, s)}
                                className={`w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-colors ${p.status === s ? 'text-blue-400' : 'text-white'}`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit2 size={16}/></button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); deletePatient(p.patientId); }}
                          className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredPatients.length === 0 && (
            <div className="py-24 text-center px-6">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-inner">
                <Search className="text-slate-300" size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No Patient Records found</h3>
              <p className="text-slate-400 text-sm mt-1">Try searching for a different name or ID in your registry.</p>
            </div>
          )}
        </div>
      </div>

      {/* Drawers & Modals */}
      <PatientDrawer 
        isOpen={isDrawerOpen} 
        patient={selectedPatient} 
        onClose={() => setIsDrawerOpen(false)} 
      />
      
      <AddPatientModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={savePatient}
      />

    </div>
  );
}
