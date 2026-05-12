import React, { useState, useEffect } from 'react';
import { 
  Shield, Users, Activity, AlertTriangle, Lock, ShieldCheck, 
  Search, Filter, Plus, X, CheckCircle, Trash2, 
  ArrowRight, Key, Globe, Clock, AlertCircle, Info, MoreVertical,
  RefreshCw, TrendingUp, PieChart, ChevronRight, FileSearch
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Chart Initialization
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  Title, Tooltip, Legend, Filler
);

// --- TOAST COMPONENT --- //
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;
  return (
    <div className={`fixed bottom-6 right-6 ${type === 'danger' ? 'bg-red-600' : 'bg-slate-900'} text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-slide-up z-[300] border border-white/10`}>
      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
        {type === 'danger' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
      </div>
      <div className="flex flex-col">
        <span className="font-black text-[10px] uppercase tracking-widest opacity-70">{type === 'danger' ? 'System Alert' : 'Success Notification'}</span>
        <span className="font-bold text-sm tracking-tight">{message}</span>
      </div>
      <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg ml-4 transition">
        <X size={18} />
      </button>
    </div>
  );
};

// --- LOCKDOWN MODAL --- //
const LockdownModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-scale-up border-4 border-red-50">
        <div className="p-8 text-center pt-10">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-inner">
            <Lock size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">SYSTEM LOCKDOWN</h2>
          <p className="text-slate-500 text-sm font-medium px-4">
            Are you sure you want to terminate all active sessions and block new access? This action is logged for compliance.
          </p>
        </div>
        
        <div className="p-8 bg-slate-50 flex flex-col gap-3">
          <button 
            onClick={onConfirm}
            className="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-red-700 hover:shadow-xl hover:shadow-red-200 transition-all active:scale-95"
          >
            Confirm Lockdown
          </button>
          <button 
            onClick={onClose}
            className="w-full bg-white text-slate-400 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:text-slate-600 transition-colors"
          >
            Cancel Action
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN SECURITY PAGE --- //
export default function SecurityPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('All');
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [isSecure, setIsSecure] = useState(true);
  const [activeAlerts, setActiveAlerts] = useState([]);

  // Dummy Security Logs
  const [logs] = useState([
    { id: 1, time: '10:45 AM', event: 'Admin Login', ip: '192.168.1.45', level: 'Success', icon: <CheckCircle size={14}/> },
    { id: 2, time: '10:32 AM', event: 'Failed Attempt (Invalid Pass)', ip: '45.12.89.2', level: 'Warning', icon: <AlertTriangle size={14}/> },
    { id: 3, time: '09:12 AM', event: 'Role Permission Changed', ip: '192.168.1.12', level: 'Info', icon: <Info size={14}/> },
    { id: 4, time: '08:55 AM', event: 'DB Backup Completed', ip: 'localhost', level: 'Success', icon: <CheckCircle size={14}/> },
  ]);

  // Chart Data
  const chartData = {
    labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM', '12AM'],
    datasets: [
      {
        label: 'Security Threats',
        data: [2, 5, 3, 12, 4, 8, 3],
        borderColor: '#ef4444', 
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#ef4444'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { display: false },
      x: { grid: { display: false }, ticks: { font: { weight: 'bold', size: 10 }, color: '#94a3b8' } }
    }
  };

  const handleLockdown = () => {
    setIsLockModalOpen(false);
    setIsSecure(false);
    setToast({ message: 'SYSTEM IN LOCKDOWN: BLOCKING ALL PORTS', type: 'danger' });
    setActiveAlerts([{ id: Date.now(), msg: 'Critical: System Lockdown in Effect', time: 'Just now' }]);
  };

  const runDiagnostics = () => {
    setToast({ message: 'Running 256-bit encryption audit...', type: 'success' });
    setTimeout(() => {
      setToast({ message: 'Vault analysis complete. System stabilized.', type: 'success' });
      setActiveAlerts([]);
      setIsSecure(true);
    }, 2000);
  };

  return (
    <div className="pb-10 animate-fade-in">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      <LockdownModal 
        isOpen={isLockModalOpen} 
        onClose={() => setIsLockModalOpen(false)} 
        onConfirm={handleLockdown} 
      />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3 italic">
             Command Center
          </h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1 italic flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isSecure ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
            Vault Status: {isSecure ? 'Secure' : 'Alert'} • ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>
        </div>
        
        <button 
          onClick={() => isSecure ? setIsLockModalOpen(true) : runDiagnostics()}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl hover:-translate-y-1 active:scale-95 ${
            isSecure ? 'bg-red-600 text-white shadow-red-100 hover:bg-red-700' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100'
          }`}
        >
          {isSecure ? <Lock size={16} /> : <ShieldCheck size={16} />} 
          {isSecure ? 'Trigger Lockdown' : 'Restore System'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Users', val: '1,245', icon: <Users size={20}/>, color: 'blue' },
          { label: 'Active Sessions', val: '84', icon: <Activity size={20}/>, color: 'emerald' },
          { label: 'Failed Attempts', val: '12', icon: <AlertTriangle size={20}/>, color: 'orange' },
          { label: 'Shield Status', val: isSecure ? '100%' : '20%', icon: <Shield size={20}/>, color: isSecure ? 'emerald' : 'red' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-7 rounded-[2rem] border border-slate-100 group hover:border-blue-100 transition-all cursor-default">
            <div className={`w-12 h-12 rounded-2xl mb-4 bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-3xl font-black text-slate-800 tracking-tight ${stat.color === 'red' && !isSecure ? 'text-red-600' : ''}`}>{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <h2 className="text-xl font-black uppercase tracking-widest mb-6 flex items-center gap-3">
                <Key className="text-blue-400" size={24}/> Privilege Grid
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {['Root Admin', 'Chief Surgeon', 'Resident Staff'].map((role, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer flex justify-between items-center group">
                    <div>
                      <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-1">Access Lvl {3-i}</p>
                      <p className="font-bold text-sm">{role}</p>
                    </div>
                    <ChevronRight size={14} className="text-white/20 group-hover:text-white transition-all" />
                  </div>
                ))}
              </div>
              <button className="flex items-center gap-2 bg-blue-600 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all">
                Permission Overrides <ArrowRight size={14}/>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-3">
                <Globe className="text-emerald-500" size={24}/> Live Traffic
              </h2>
              <select className="bg-slate-50 border-none rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest outline-none">
                <option>Most Recent</option> <option>Failures Only</option>
              </select>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="p-8 border-b border-slate-50">Time</th>
                    <th className="p-8 border-b border-slate-50">Event Intelligence</th>
                    <th className="p-8 border-b border-slate-50">Address</th>
                    <th className="p-8 border-b border-slate-50 text-right">State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {logs.map(log => (
                    <tr key={log.id} className="group hover:bg-slate-50/50 transition-all cursor-default">
                      <td className="p-8 text-sm font-bold text-slate-700">{log.time}</td>
                      <td className="p-8 italic font-semibold text-slate-800 text-sm">{log.event}</td>
                      <td className="p-8"><span className="bg-slate-100 px-3 py-1 rounded-lg font-mono text-[10px] text-slate-500">{log.ip}</span></td>
                      <td className="p-8 text-right">
                        <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                          log.level === 'Success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                        }`}>
                          {log.level}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
            <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6">Threat Analysis</h2>
            <div className="h-48">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 group relative overflow-hidden">
            <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6">Security Actions</h2>
            
            {activeAlerts.length > 0 ? (
              <div className="space-y-4">
                {activeAlerts.map(alert => (
                  <div key={alert.id} className="bg-red-50 border-2 border-red-100 p-4 rounded-2xl flex items-center gap-4 animate-shake">
                    <AlertTriangle className="text-red-600 shrink-0" size={24} />
                    <div>
                      <p className="text-xs font-black text-red-900 leading-tight uppercase italic">{alert.msg}</p>
                      <p className="text-[10px] font-bold text-red-400 mt-1 uppercase">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-inner">
                   <ShieldCheck size={40} />
                </div>
                <h3 className="font-black text-slate-800 uppercase tracking-tight">System Guarded</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Audit complete</p>
                <button onClick={runDiagnostics} className="text-[10px] font-black text-emerald-600 uppercase tracking-widest pt-6 border-b-2 border-emerald-100 hover:border-emerald-500 transition-all">Scan Database</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
