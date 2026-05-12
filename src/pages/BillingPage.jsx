import React, { useState, useEffect } from 'react';
import { Receipt, Plus, Search, Filter, X, CheckCircle, CreditCard, FileText, IndianRupee } from 'lucide-react';
import billingData from '../data/billing.json';
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

const GenerateInvoiceModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    patientId: '', amount: '', services: '', paymentMode: 'Cash'
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const patient = patientsData.find(p => p.patientId === formData.patientId);
    
    setTimeout(() => {
      onSave({
        ...formData,
        billId: `BILL-${Math.floor(Math.random() * 9000) + 1000}`,
        patientName: patient?.fullName || 'Walk-in Patient',
        date: new Date().toISOString(),
        amount: parseFloat(formData.amount),
        status: 'Pending'
      });
      setLoading(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-scale-up">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-amber-50/50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
             New Invoice
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl transition"><X size={20}/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Select Patient</label>
            <select required className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-amber-600 outline-none transition appearance-none"
              value={formData.patientId} onChange={e => setFormData({...formData, patientId: e.target.value})}>
              <option value="">-- Choose Patient --</option>
              {patientsData.map(p => <option key={p.patientId} value={p.patientId}>{p.fullName} ({p.patientId})</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Services / Treatment</label>
            <input required type="text" placeholder="e.g. Blood Test, Consultation" className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-amber-600 outline-none transition"
              value={formData.services} onChange={e => setFormData({...formData, services: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Amount (₹)</label>
              <input required type="number" placeholder="2500" className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-amber-600 outline-none transition"
                value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Payment Mode</label>
              <select className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-amber-600 outline-none transition appearance-none"
                value={formData.paymentMode} onChange={e => setFormData({...formData, paymentMode: e.target.value})}>
                <option>Cash</option> <option>UPI / Online</option> <option>Card</option> <option>Insurance</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 text-sm font-bold text-slate-400 hover:text-slate-600 transition">Discard</button>
            <button type="submit" disabled={loading} className="flex-[2] py-4 rounded-2xl text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-100">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <IndianRupee size={18} />}
              {loading ? 'Generating...' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function BillingPage() {
  const [invoices, setInvoices] = useState(billingData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState('');

  const filteredInvoices = invoices.filter(inv => 
    inv.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    inv.billId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddInvoice = (newBill) => {
    setInvoices([newBill, ...invoices]);
    setToast(`Invoice ${newBill.billId} generated for ${newBill.patientName}`);
  };

  return (
    <div className="animate-fade-in pb-10">
      <Toast message={toast} onClose={() => setToast('')} />

      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
             Inventory & Bills
          </h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
            Tracked {invoices.length} transactions in this cycle
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search Bill ID or Name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3.5 bg-white border border-slate-100 rounded-2xl text-sm font-semibold w-full md:w-64 focus:ring-4 focus:ring-amber-50 focus:border-amber-200 outline-none shadow-sm transition-all"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-amber-600 text-white px-6 py-3.5 rounded-2xl hover:bg-amber-700 hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-200 transition-all flex items-center justify-center gap-2 font-bold text-sm shadow-lg shadow-amber-100"
          >
            <Plus size={18} /> New Invoice
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-400 border-b border-slate-50">
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-center">Receipt</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest">Client & Services</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest">Amount</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest">Status</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredInvoices.map((inv) => (
              <tr key={inv.billId} className="group hover:bg-amber-50/30 transition-all cursor-default">
                <td className="p-6">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex flex-col items-center justify-center border border-slate-100 group-hover:bg-white group-hover:shadow-sm transition-all">
                    <span className="text-[10px] font-black text-slate-400 leading-none">INV</span>
                    <span className="text-xs font-black text-slate-800 mt-1">{inv.billId.split('-')[1]}</span>
                  </div>
                </td>
                <td className="p-6">
                  <div className="font-bold text-slate-800">{inv.patientName}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[200px]">{inv.services}</div>
                </td>
                <td className="p-6">
                  <div className="font-black text-slate-900 text-lg">₹{inv.amount.toLocaleString()}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{new Date(inv.date).toLocaleDateString()}</div>
                </td>
                <td className="p-6">
                  <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                    inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                    'bg-red-50 text-red-700 border-red-100'
                  }`}>
                    {inv.status}
                  </span>
                </td>
                <td className="p-6 text-right">
                  <button className="text-[10px] font-black uppercase tracking-widest text-amber-600 hover:bg-amber-100 px-4 py-2 rounded-xl transition">View Ledger</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <GenerateInvoiceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddInvoice} 
      />
    </div>
  );
}
