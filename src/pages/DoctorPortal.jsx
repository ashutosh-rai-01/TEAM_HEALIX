import React, { useState } from 'react';
import { 
  Users, Calendar, FileText, Clock, AlertCircle, Settings, 
  ChevronRight, Activity, ClipboardList, Stethoscope, LogOut,
  Bell, Search, TrendingUp, Filter, CheckCircle
} from 'lucide-react';
import patientsData from '../data/patients.json';
import appointmentsData from '../data/appointments.json';

export default function DoctorPortal() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Simulated Doctor Stats
  const stats = [
    { label: 'My Patients', val: '24', icon: <Users size={20}/>, color: 'blue' },
    { label: "Today's Appts", val: '8', icon: <Calendar size={20}/>, color: 'purple' },
    { label: 'Critical Alerts', val: '3', icon: <AlertCircle size={20}/>, color: 'red' },
    { label: 'Success Rate', val: '98%', icon: <CheckCircle size={20}/>, color: 'emerald' },
  ];

  const cards = [
    { title: 'Appointments', desc: 'Manage your daily schedule', icon: <Calendar size={28}/>, color: 'purple' },
    { title: 'Patient Records', desc: 'EMR, History & Vitals', icon: <ClipboardList size={28}/>, color: 'blue' },
    { title: 'Prescriptions', desc: 'Issue digital prescriptions', icon: <Stethoscope size={28}/>, color: 'emerald' },
    { title: 'Lab Reports', desc: 'Review diagnosis results', icon: <FileText size={28}/>, color: 'cyan' },
    { title: 'Duty Roster', desc: 'On-call & shift timings', icon: <Clock size={28}/>, color: 'orange' },
    { title: 'Emergency SOS', desc: 'Urgent case notifications', icon: <AlertCircle size={28}/>, color: 'red', isCritical: true },
  ];

  return (
    <div className="pb-10 animate-fade-in font-inter">
      {/* Welcome Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
             Doctor Dashboard
          </h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1 italic">
             SoftCare Specialist Portal • Dr. Sarah Jenkins (M.D.)
          </p>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input 
                type="text" placeholder="Quick find patient..." 
                className="pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-bold w-64 focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none shadow-sm transition-all"
              />
           </div>
           <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-500 transition-all shadow-sm">
              <Settings size={20} />
           </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-default group overflow-hidden relative">
            <div className={`p-4 rounded-xl mb-4 bg-${stat.color}-50 text-${stat.color}-600 inline-flex group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-slate-800 tracking-tighter">{stat.val}</p>
            {/* Minimal background graph simulation */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-100 to-transparent"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Menu Grid (2/3 width) */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, i) => (
            <div key={i} className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer relative overflow-hidden">
               <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:scale-150 transition-transform duration-700 text-${card.color}-600`}>
                  {card.icon}
               </div>
               <div className="relative z-10">
                 <div className={`w-14 h-14 rounded-2xl bg-${card.color}-50 text-${card.color}-600 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform`}>
                    {card.icon}
                 </div>
                 <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2 uppercase">{card.title}</h3>
                 <p className="text-xs font-bold text-slate-400 leading-relaxed mb-8">{card.desc}</p>
                 
                 <div className={`inline-flex items-center gap-2 font-black text-[10px] uppercase tracking-widest ${card.isCritical ? 'text-red-500' : 'text-slate-400 group-hover:text-slate-800'} transition-colors`}>
                    Enter Portal <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                 </div>
               </div>
            </div>
          ))}
        </div>

        {/* Sidebar: Upcoming Appointments & Activity */}
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2 text-blue-400">
               <Activity size={16} /> Patient Activity
            </h2>
            <div className="space-y-6">
               {[
                 { name: 'John Cooper', status: 'In Consultation', time: 'Now' },
                 { name: 'Alice Smith', status: 'Waiting in OPD', time: '10 mins' },
                 { name: 'Robert Fox', status: 'Reports Ready', time: '30 mins' },
               ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center group cursor-default">
                    <div>
                      <p className="text-sm font-black group-hover:text-blue-400 transition-colors uppercase tracking-tight">{item.name}</p>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.status}</p>
                    </div>
                    <span className="text-[10px] font-black bg-white/5 border border-white/10 px-3 py-1 rounded-full">{item.time}</span>
                  </div>
               ))}
            </div>
            <button className="w-full mt-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
               View Full Timeline
            </button>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm group">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest">Medical Insights</h2>
                <TrendingUp size={16} className="text-emerald-500" />
             </div>
             <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:border-blue-100 transition-all">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Weekly Efficiency</p>
                   <p className="text-xl font-black text-slate-800">+12.5%</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:border-emerald-100 transition-all">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Patient SAT Score</p>
                   <p className="text-xl font-black text-emerald-600">4.9 / 5.0</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
