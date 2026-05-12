import React, { useState, useEffect } from 'react';
import { Pill, Plus, Search, Filter, X, CheckCircle, Package, AlertCircle } from 'lucide-react';

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

const AddMedicineModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '', category: 'Painkiller', stock: '', price: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSave({
        ...formData,
        id: `MED-${Math.floor(Math.random() * 900) + 100}`,
        status: parseInt(formData.stock) > 50 ? 'In Stock' : 'Low Stock'
      });
      setLoading(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-scale-up">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-emerald-50/50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
             Add Inventory
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl transition"><X size={20}/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Medicine Name</label>
            <input required type="text" placeholder="e.g. Paracetamol" className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-emerald-600 outline-none transition"
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
            <select className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-emerald-600 outline-none transition appearance-none"
              value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option>Painkiller</option> <option>Antibiotic</option> <option>Vitamin</option> <option>Syrup</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Stock Qty</label>
              <input required type="number" placeholder="500" className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-emerald-600 outline-none transition"
                value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Price (₹)</label>
              <input required type="number" placeholder="45" className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-emerald-600 outline-none transition"
                value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 text-sm font-bold text-slate-400 hover:text-slate-600 transition">Cancel</button>
            <button type="submit" disabled={loading} className="flex-[2] py-4 rounded-2xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Package size={18} />}
              {loading ? 'Adding...' : 'Add to Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function PharmacyPage() {
  const [inventory, setInventory] = useState([
    { id: 'MED-01', name: 'Paracetamol 500mg', stock: 1200, category: 'Painkiller', status: 'In Stock' },
    { id: 'MED-02', name: 'Amoxicillin 250mg', stock: 45, category: 'Antibiotic', status: 'Low Stock' },
    { id: 'MED-03', name: 'Ibuprofen 400mg', stock: 0, category: 'Painkiller', status: 'Out of Stock' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState('');

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMedicine = (newMed) => {
    setInventory([newMed, ...inventory]);
    setToast(`${newMed.name} added to pharmacy inventory`);
  };

  return (
    <div className="animate-fade-in pb-10">
      <Toast message={toast} onClose={() => setToast('')} />

      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
             Pharmacy
          </h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
            Managing {inventory.length} medical lines in inventory
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search medicine..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3.5 bg-white border border-slate-100 rounded-2xl text-sm font-semibold w-full md:w-64 focus:ring-4 focus:ring-emerald-50 focus:border-emerald-200 outline-none shadow-sm transition-all"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 text-white px-6 py-3.5 rounded-2xl hover:bg-emerald-700 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-200 transition-all flex items-center justify-center gap-2 font-bold text-sm shadow-lg shadow-emerald-100"
          >
            <Plus size={18} /> Add Medicine
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-400 border-b border-slate-50">
              <th className="p-6 text-[10px] font-black uppercase tracking-widest">Med ID</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest">Product Details</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest">Inventory</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest">Status</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredInventory.map((item) => (
              <tr key={item.id} className="group hover:bg-emerald-50/30 transition-all">
                <td className="p-6 font-bold text-slate-400 text-xs">#{item.id}</td>
                <td className="p-6">
                  <div className="font-bold text-slate-800">{item.name}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.category}</div>
                </td>
                <td className="p-6">
                  <div className="font-bold text-slate-700 text-sm">{item.stock} Unit</div>
                  <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                    <div className={`h-full rounded-full ${item.stock > 100 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                      style={{ width: `${Math.min(100, item.stock/10)}%` }}></div>
                  </div>
                </td>
                <td className="p-6">
                  <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                    item.status === 'In Stock' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                    item.status === 'Low Stock' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                    'bg-red-50 text-red-700 border-red-100'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-6 text-right">
                  <button className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg transition">Restock</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddMedicineModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddMedicine} 
      />
    </div>
  );
}
