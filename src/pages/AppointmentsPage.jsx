import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Search, Filter, X, CheckCircle, Clock, User, UserPlus } from 'lucide-react';
import appointmentsData from '../data/appointments.json';
import patientsData from '../data/patients.json';
import doctorsData from '../data/doctors.json';

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

const AddAppointmentModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    patientId: '', doctorId: '', date: '', time: '10:00 AM', reason: '', status: 'Scheduled'
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    const patient = patientsData.find(p => p.patientId === formData.patientId);
    const doctor = doctorsData.find(d => d.doctorId === formData.doctorId);

    setTimeout(() => {
      onSave({
        ...formData,
        appointmentId: `APT${Math.floor(Math.random() * 9000) + 1000}`,
        patientName: patient?.fullName || 'Unknown Patient',
        doctorName: doctor?.fullName || 'Unknown Doctor'
      });
      setLoading(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-purple-50/50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-200">
              <Calendar size={24}/>
            </div>
            Book Appointment
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-white transition"><X size={20}/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Select Patient</label>
              <select required className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-purple-600 outline-none transition appearance-none"
                value={formData.patientId} onChange={e => setFormData({...formData, patientId: e.target.value})}>
                <option value="">-- Patient --</option>
                {patientsData.map(p => <option key={p.patientId} value={p.patientId}>{p.fullName}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Select Doctor</label>
              <select required className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-purple-600 outline-none transition appearance-none"
                value={formData.doctorId} onChange={e => setFormData({...formData, doctorId: e.target.value})}>
                <option value="">-- Doctor --</option>
                {doctorsData.map(d => <option key={d.doctorId} value={d.doctorId}>{d.fullName}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Date</label>
              <input required type="date" className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-purple-600 outline-none transition"
                value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Time Slot</label>
              <select className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-purple-600 outline-none transition appearance-none"
                value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}>
                <option>09:00 AM</option> <option>10:00 AM</option> <option>11:30 AM</option>
                <option>02:00 PM</option> <option>04:00 PM</option> <option>06:30 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Reason for Visit</label>
            <input required type="text" placeholder="e.g. Regular Checkup" className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-purple-600 outline-none transition"
              value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} />
          </div>

          <div className="pt-4 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 text-sm font-bold text-slate-400 hover:text-slate-600 transition">Cancel</button>
            <button type="submit" disabled={loading} className="flex-[2] py-4 rounded-2xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 hover:shadow-xl hover:shadow-purple-200 transition-all flex items-center justify-center gap-2">
              {loading ? <Clock size={18} className="animate-spin" /> : <CheckCircle size={18} />}
              {loading ? 'Processing...' : 'Confirm Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState(appointmentsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState('');

  const filteredAppointments = appointments.filter(a => {
    const matchesSearch = a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.appointmentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || a.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const saveAppointment = (newApt) => {
    setAppointments([newApt, ...appointments]);
    setToast(`Appointment confirmed for ${newApt.patientName}`);
  };

  return (
    <div className="animate-fade-in pb-10">
      <Toast message={toast} onClose={() => setToast('')} />

      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
             Scheduling
          </h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Manage {appointments.length} active bookings</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search bookings..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3.5 bg-white border border-slate-100 rounded-2xl text-sm font-semibold w-full md:w-64 focus:ring-4 focus:ring-purple-50 focus:border-purple-200 outline-none shadow-sm transition-all"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-600 text-white px-6 py-3.5 rounded-2xl hover:bg-purple-700 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-200 transition-all flex items-center justify-center gap-2 font-bold text-sm shadow-lg shadow-purple-100"
          >
            <Plus size={18} /> Add Booking
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50 bg-slate-50/30 flex gap-2">
          {['All', 'Scheduled', 'Completed', 'Cancelled'].map(status => (
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
              <tr className="text-slate-400">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest border-b border-slate-50">Schedule</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest border-b border-slate-50">Patient Details</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest border-b border-slate-50">Consultant</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest border-b border-slate-50">Status</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest border-b border-slate-50 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredAppointments.map((a) => (
                <tr key={a.appointmentId} className="group hover:bg-purple-50/30 transition-all cursor-default">
                  <td className="p-6">
                    <div className="font-black text-slate-800 text-sm">{new Date(a.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}</div>
                    <div className="text-xs font-bold text-purple-600 mt-0.5">{a.time}</div>
                  </td>
                  <td className="p-6">
                    <div className="font-bold text-slate-800">{a.patientName}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">ID: {a.patientId} • {a.reason}</div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-[10px]">
                        {a.doctorName.replace('Dr. ', '').split(' ').map(n=>n[0]).join('')}
                      </div>
                      <div className="font-bold text-slate-700 text-sm">{a.doctorName}</div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                      a.status === 'Scheduled' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      a.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      'bg-red-50 text-red-700 border-red-100'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-purple-600 transition-colors">Manage Record</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredAppointments.length === 0 && (
            <div className="py-24 text-center">
              <Calendar className="mx-auto text-slate-200 mb-4" size={48} />
              <p className="text-slate-400 font-bold">No appointments matched your query</p>
            </div>
          )}
        </div>
      </div>

      <AddAppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={saveAppointment} 
      />
    </div>
  );
}
