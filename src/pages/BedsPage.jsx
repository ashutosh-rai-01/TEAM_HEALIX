import React, { useState, useEffect } from 'react';
import { Bed as BedIcon, Plus, Search, Filter, X, CheckCircle, Activity, LayoutGrid } from 'lucide-react';
import bedsData from '../data/beds.json';
import patientsData from '../data/patients.json';

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

const AllocateBedModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    bedId: '', patientId: '', ward: 'General Ward'
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSave(formData);
      setLoading(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-scale-up">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-teal-50/50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
             Allocate Bed
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl transition"><X size={20}/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Select Patient</label>
            <select required className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-teal-600 outline-none transition appearance-none"
              value={formData.patientId} onChange={e => setFormData({...formData, patientId: e.target.value})}>
              <option value="">-- Choose Patient --</option>
              {patientsData.map(p => <option key={p.patientId} value={p.patientId}>{p.fullName} ({p.patientId})</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ward Type</label>
            <select className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-teal-600 outline-none transition appearance-none"
              value={formData.ward} onChange={e => setFormData({...formData, ward: e.target.value})}>
              <option>General Ward</option>
              <option>ICU Ward</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Bed Number</label>
            <input required type="text" placeholder="e.g. B-101" className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-teal-600 outline-none transition"
              value={formData.bedId} onChange={e => setFormData({...formData, bedId: e.target.value})} />
          </div>

          <div className="pt-4 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 text-sm font-bold text-slate-400 hover:text-slate-600 transition">Cancel</button>
            <button type="submit" disabled={loading} className="flex-[2] py-4 rounded-2xl text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 transition-all flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Activity size={18} />}
              {loading ? 'Allocating...' : 'Confirm Allocation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function BedsPage() {
  const [beds, setBeds] = useState(bedsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterWard, setFilterWard] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState('');

  const wards = ['All', ...new Set(beds.map(b => b.ward))];

  const filteredBeds = beds.filter(b => {
    const matchesSearch = b.bedId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (b.assignedPatientId && b.assignedPatientId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterWard === 'All' || b.ward === filterWard;
    return matchesSearch && matchesFilter;
  });

  const handleAllocate = (allocation) => {
    // If bed exists, update it. If not, add new.
    const exists = beds.find(b => b.bedId === allocation.bedId);
    if (exists) {
      setBeds(beds.map(b => b.bedId === allocation.bedId ? { ...b, status: 'Occupied', assignedPatientId: allocation.patientId } : b));
    } else {
      setBeds([{ ...allocation, status: 'Occupied', assignedPatientId: allocation.patientId }, ...beds]);
    }
    setToast(`Bed ${allocation.bedId} successfully allocated`);
  };

  return (
    <div className="animate-fade-in pb-10">
      <Toast message={toast} onClose={() => setToast('')} />

      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
             Bed Inventory
          </h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
            {beds.filter(b => b.status === 'Available').length} units ready for admission
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search Bed or Patient ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3.5 bg-white border border-slate-100 rounded-2xl text-sm font-semibold w-full md:w-64 focus:ring-4 focus:ring-teal-50 focus:border-teal-200 outline-none shadow-sm transition-all"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-teal-600 text-white px-6 py-3.5 rounded-2xl hover:bg-teal-700 hover:scale-[1.02] hover:shadow-xl hover:shadow-teal-200 transition-all flex items-center justify-center gap-2 font-bold text-sm shadow-lg shadow-teal-100"
          >
            <Plus size={18} /> Manage Allocation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredBeds.map(bed => (
          <div key={bed.bedId} className={`group relative bg-white border rounded-[2rem] p-6 text-center transition-all hover:shadow-xl hover:-translate-y-1 ${
            bed.status === 'Occupied' ? 'border-orange-100' :
            bed.status === 'Maintenance' ? 'border-amber-100' :
            'border-emerald-100'
          }`}>
            <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${
               bed.status === 'Occupied' ? 'bg-orange-500 animate-pulse' :
               bed.status === 'Available' ? 'bg-emerald-500' : 'bg-amber-500'
            }`}></div>
            
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
              bed.status === 'Occupied' ? 'bg-orange-50 text-orange-600' :
              bed.status === 'Maintenance' ? 'bg-amber-50 text-amber-600' :
              'bg-emerald-50 text-emerald-600'
            }`}>
              <BedIcon size={24} />
            </div>

            <h3 className="font-black text-xl text-slate-800">{bed.bedId}</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">{bed.ward}</p>
            
            <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest mb-4 inline-block ${
              bed.status === 'Occupied' ? 'bg-orange-100 text-orange-700' :
              bed.status === 'Maintenance' ? 'bg-amber-100 text-amber-700' :
              'bg-emerald-100 text-emerald-700'
            }`}>
              {bed.status}
            </div>
            
            <div className="pt-4 border-t border-slate-50">
              {bed.assignedPatientId ? (
                <div className="text-[10px] font-black text-slate-500">
                  PT: <span className="text-slate-800">{bed.assignedPatientId}</span>
                </div>
              ) : (
                <div className="text-[10px] font-black text-emerald-500">VACANT</div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {filteredBeds.length === 0 && (
        <div className="text-center py-24">
          <LayoutGrid className="mx-auto text-slate-100 mb-4" size={64} />
          <p className="text-slate-400 font-bold">No beds found in this wing</p>
        </div>
      )}

      <AllocateBedModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAllocate} 
      />
    </div>
  );
}
