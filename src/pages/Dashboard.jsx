import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const AnimatedCounter = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const duration = 1500;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - (1 - progress) * (1 - progress);
      setCount(Math.floor(easeProgress * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };
    window.requestAnimationFrame(step);
  }, [value]);

  return <>{count}</>;
};
import { 
  Users, UserPlus, Calendar, Bed, Pill, TestTube, FileText, 
  AlertOctagon, Receipt, Activity, CheckCircle, Clock, ChevronRight,
  TrendingDown, TrendingUp, Search, Bell, Monitor
} from 'lucide-react';
import patientsData from '../data/patients.json';
import doctorsData from '../data/doctors.json';
import appointmentsData from '../data/appointments.json';
import bedsData from '../data/beds.json';

export default function Dashboard() {
  const navigate = useNavigate();

  const totalPatients = patientsData.length;
  const criticalPatients = patientsData.filter(p => p.status === 'Critical').length;
  const admittedPatients = patientsData.filter(p => p.status === 'Admitted').length;
  
  const totalDoctors = doctorsData.length;
  const availableDoctors = doctorsData.filter(d => d.availability === 'Available').length;
  
  const totalAppointments = appointmentsData.length;
  const pendingAppointments = appointmentsData.filter(a => a.status === 'Scheduled').length;
  
  const availableBeds = bedsData.filter(b => b.status === 'Available').length;
  const icuBedsAvailable = bedsData.filter(b => b.ward.includes('ICU') && b.status === 'Available').length;

  const STATS = [
    { title: 'Total Patients', value: totalPatients, subtitle: `${criticalPatients} Critical • ${admittedPatients} Admitted`, icon: <Users size={20} className="text-blue-600" />, color: 'bg-blue-50', path: '/patients' },
    { title: 'Appts Pending', value: pendingAppointments, subtitle: `Next up in 15 mins`, icon: <Calendar size={20} className="text-purple-600" />, color: 'bg-purple-50', path: '/appointments' },
    { title: 'Doctors On Duty', value: availableDoctors, subtitle: `3 Specialist On-Call`, icon: <UserPlus size={20} className="text-indigo-600" />, color: 'bg-indigo-50', path: '/doctors' },
    { title: 'Beds Available', value: availableBeds, subtitle: `${icuBedsAvailable} ICU Beds Open`, icon: <Bed size={20} className="text-teal-600" />, color: 'bg-teal-50', path: '/beds' }
  ];

  const CARDS = [
    { title: 'Patient Hub', path: '/patients', icon: <Users size={24} className="text-blue-600"/>, desc: 'Admissions & EMR Records', accent: 'blue' },
    { title: 'Staff Gateway', path: '/doctors', icon: <UserPlus size={24} className="text-indigo-600"/>, desc: 'Roster & Duty Management', accent: 'indigo' },
    { title: 'Appointments', path: '/appointments', icon: <Calendar size={24} className="text-purple-600"/>, desc: 'OPD & Surgery Scheduler', accent: 'purple' },
    { title: 'ER & Ward', path: '/beds', icon: <Bed size={24} className="text-teal-600"/>, desc: 'Real-time Bed Allocation', accent: 'teal' },
    { title: 'Pharmacy', path: '/pharmacy', icon: <Pill size={24} className="text-emerald-600"/>, desc: 'Stock & Prescription Audit', accent: 'emerald' },
    { title: 'Lab Diagnostics', path: '/lab', icon: <TestTube size={24} className="text-cyan-600"/>, desc: 'Radiology & Sample Tracking', accent: 'cyan' },
    { title: 'Revenue Control', path: '/billing', icon: <Receipt size={24} className="text-amber-600"/>, desc: 'Invoicing & Claims Portal', accent: 'amber' },
    { title: 'Intelligence', path: '/reports', icon: <FileText size={24} className="text-orange-600"/>, desc: 'Data-driven Performance', accent: 'orange' },
    { title: 'Security', path: '/security', icon: <AlertOctagon size={24} className="text-red-600"/>, desc: 'Access Matrix & Vault Control', accent: 'red', isCritical: true },
  ];

  return (
    <div className="pb-10 animate-fade-in">
      {/* Top Welcome Bar */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight italic">
            SoftCare <span className="text-blue-600">Pro</span>
          </h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
            <Monitor size={14} className="text-emerald-500" /> Central Management System • {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm pr-6">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xs">AD</div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Logged as</p>
            <p className="text-sm font-black text-slate-800">
              {new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening'}, Admin!
            </p>
          </div>
          <div className="ml-4 pl-4 border-l border-slate-100">
            <div className="relative">
              <Bell size={20} className="text-slate-400 hover:text-blue-600 cursor-pointer transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </div>
          </div>
        </div>
      </header>

      {/* KPI Cards - Clickable Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {STATS.map((stat, i) => (
          <div 
            key={i} 
            onClick={() => navigate(stat.path)}
            className="group bg-white rounded-[2rem] border border-slate-100 p-7 flex items-start gap-5 hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className={`p-4 rounded-2xl ${stat.color} group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.title}</p>
              <h3 className="text-3xl font-black text-slate-800 tracking-tighter"><AnimatedCounter value={stat.value} /></h3>
              <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase flex items-center gap-1">
                <TrendingUp size={12} className="text-emerald-500" /> {stat.subtitle}
              </p>
            </div>
            <div className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-10 transition-opacity">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-4">
        Core Command Modules <span className="h-px bg-slate-100 flex-1"></span>
      </h2>

      {/* Hospital Activity Chart */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50 mb-12">
        <h3 className="text-xl font-black text-slate-800 tracking-tight mb-6">Hospital Activity (Last 7 Days)</h3>
        <div className="h-64 w-full">
          <Line 
            data={{
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              datasets: [
                {
                  label: 'Admissions',
                  data: [12, 19, 15, 25, 22, 30, 28],
                  borderColor: '#2563eb',
                  backgroundColor: 'rgba(37, 99, 235, 0.1)',
                  fill: true,
                  tension: 0.4
                },
                {
                  label: 'Discharges',
                  data: [10, 15, 13, 20, 18, 25, 22],
                  borderColor: '#10b981',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  fill: true,
                  tension: 0.4
                }
              ]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                y: { display: false, grid: { display: false } },
                x: { grid: { display: false }, border: { display: false } }
              },
              interaction: { intersect: false, mode: 'index' }
            }}
          />
        </div>
      </div>

      {/* Main Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {CARDS.map((card, i) => (
          <div
            key={i}
            onClick={() => navigate(card.path)}
            className={`group flex flex-col justify-between bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-slate-200 hover:-translate-y-2 transition-all duration-500 border border-slate-50 cursor-pointer relative overflow-hidden`}
          >
            {/* Background Decoration */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-${card.accent}-50/50 group-hover:scale-150 transition-transform duration-700`}></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-${card.accent}-50 flex items-center justify-center group-hover:rotate-6 transition-transform shadow-inner`}>
                  {card.icon}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">{card.title}</h3>
                  <div className={`h-1 w-6 bg-${card.accent}-500 rounded-full mt-1 group-hover:w-16 transition-all duration-500`}></div>
                </div>
              </div>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest leading-relaxed mb-10">{card.desc}</p>
            </div>

            <div className="relative z-10">
              <div className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-center border-2 transition-all flex items-center justify-center gap-2 ${
                card.isCritical 
                ? 'bg-red-50 text-red-600 border-red-100 group-hover:bg-red-600 group-hover:text-white' 
                : `bg-slate-50 text-slate-500 border-slate-100 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900`
              }`}>
                Access Protocol <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
