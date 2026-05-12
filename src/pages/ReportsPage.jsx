import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, Search, Filter, X, CheckCircle, 
  TrendingUp, Activity, PieChart, Calendar, ChevronRight,
  Printer, Share2, Eye, FileSearch, RefreshCw, FileWarning
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

export default function ReportsPage() {
  const [reports, setReports] = useState([
    { id: 'REP-01', title: 'Monthly Revenue Report', type: 'Financial', date: '2026-03-31', size: '2.4 MB', views: 128 },
    { id: 'REP-02', title: 'Patient Admission Trends', type: 'Administrative', date: '2026-03-30', size: '1.8 MB', views: 85 },
    { id: 'REP-03', title: 'Pharmacy Inventory Alert', type: 'Inventory', date: '2026-04-01', size: '840 KB', views: 210 },
    { id: 'REP-04', title: 'Doctor Efficiency Stats', type: 'Administrative', date: '2026-04-01', size: '3.1 MB', views: 45 },
    { id: 'REP-05', title: 'Quarterly Audit Log', type: 'Security', date: '2026-03-15', size: '5.2 MB', views: 12 },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [toast, setToast] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || r.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const generatePDF = (report) => {
    const doc = new jsPDF();
    
    // Add Hospital Logo / Header
    doc.setFontSize(22);
    doc.setTextColor(44, 62, 80);
    doc.text("SOFTCARE HOSPITAL SYSTEM", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Official Document ID: ${report.id} | Generated: ${new Date().toLocaleString()}`, 14, 28);
    
    doc.setDrawColor(200);
    doc.line(14, 32, 196, 32);

    // Report Title
    doc.setFontSize(18);
    doc.setTextColor(30, 30, 30);
    doc.text(report.title.toUpperCase(), 14, 45);

    // Metadata Table
    const metadata = [
      ["Parameter", "Details"],
      ["Report Type", report.type],
      ["Auto-Generated Date", report.date],
      ["Total Views", report.views.toString()],
      ["Archive Integrity", "Verified (SHA-256)"]
    ];

    doc.autoTable({
      startY: 55,
      head: [metadata[0]],
      body: metadata.slice(1),
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] }
    });

    // Content Simulation
    doc.setFontSize(14);
    doc.text("Executive Summary", 14, doc.lastAutoTable.finalY + 15);
    doc.setFontSize(10);
    doc.setTextColor(80);
    const summaryText = "This report summarizes key metrics for SoftCare Hospital. Data indicates a 15% increase in operational efficiency compared to the previous cycle. All departments are operating within safety thresholds.";
    doc.text(doc.splitTextToSize(summaryText, 180), 14, doc.lastAutoTable.finalY + 22);

    // Branding Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("CONFIDENTIAL - FOR INTERNAL USE ONLY | SOFTCARE SMART SYSTEMS", 105, 285, { align: "center" });

    // Save
    doc.save(`${report.title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
    setToast(`Document ${report.id} generated and downloaded`);
  };

  const handleShare = async (report) => {
    const shareData = {
      title: report.title,
      text: `Health Report: ${report.title} from SoftCare HMS`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setToast('Link shared successfully');
      } catch (err) {
        setToast('Share cancelled');
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(`${shareData.text} - Open at: ${shareData.url}`);
      setToast('Link copied to clipboard (Native share not supported on this browser)');
    }
  };

  const handlePrint = (report) => {
    setToast(`Sending ${report.title} to primary hospital printer...`);
    // Simulated print trigger - in real world would use window.print() on a hidden iframe
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setToast('Reports database synchronized');
    }, 1500);
  };

  return (
    <div className="animate-fade-in pb-10">
      <Toast message={toast} onClose={() => setToast('')} />

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
             Insights Explorer
          </h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
            Access secure archives & operational intelligence
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search archives..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3.5 bg-white border border-slate-100 rounded-2xl text-sm font-semibold w-full md:w-64 focus:ring-4 focus:ring-orange-50 focus:border-orange-200 outline-none shadow-sm transition-all"
            />
          </div>
          <button 
            onClick={handleRefresh}
            className="bg-orange-600 text-white px-6 py-3.5 rounded-2xl hover:bg-orange-700 hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-200 transition-all flex items-center justify-center gap-2 font-bold text-sm shadow-lg shadow-orange-100"
          >
            <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Cloud Storage', value: '84%', icon: <TrendingUp size={20}/>, color: 'orange' },
          { label: 'Active Reports', value: reports.length, icon: <Activity size={20}/>, color: 'blue' },
          { label: 'Security Compliance', value: '100%', icon: <PieChart size={20}/>, color: 'emerald' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-orange-100 transition-all">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-slate-800">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        {/* Filters Bar */}
        <div className="p-4 border-b border-slate-50 bg-slate-50/30 flex gap-2 overflow-x-auto no-scrollbar">
          {['All', 'Financial', 'Administrative', 'Inventory', 'Security'].map(type => (
            <button 
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                filterType === type 
                ? 'bg-slate-800 text-white shadow-lg shadow-slate-200 scale-105' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="divide-y divide-slate-50">
          {filteredReports.map((report) => (
            <div key={report.id} className="group p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-orange-50/20 transition-all">
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:rotate-6 ${
                  report.type === 'Financial' ? 'bg-emerald-50 text-emerald-600' :
                  report.type === 'Administrative' ? 'bg-blue-50 text-blue-600' :
                  report.type === 'Security' ? 'bg-purple-50 text-purple-600' :
                  'bg-orange-50 text-orange-600'
                }`}>
                  <FileSearch size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 group-hover:text-orange-600 transition-colors uppercase tracking-tight">{report.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Calendar size={12}/> Archive {report.date}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                    <span className="flex items-center gap-1"><Eye size={12}/> {report.views} Views</span>
                    <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                    <span className="text-slate-500">{report.size}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => generatePDF(report)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all shadow-sm"
                >
                  <Download size={14} /> PDF Action
                </button>
                <button 
                  onClick={() => handleShare(report)}
                  className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all flex items-center justify-center shadow-sm"
                  title="Share Report Link"
                >
                  <Share2 size={18} />
                </button>
                <button 
                  onClick={() => handlePrint(report)}
                  className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-emerald-600 hover:border-emerald-100 transition-all flex items-center justify-center shadow-sm"
                  title="Print Document"
                >
                  <Printer size={18} />
                </button>
              </div>
            </div>
          ))}
          
          {filteredReports.length === 0 && (
            <div className="py-24 text-center">
              <FileWarning className="mx-auto text-slate-200 mb-4" size={64} />
              <p className="text-slate-400 font-bold uppercase tracking-widest">Archive Vault Empty for this segment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
