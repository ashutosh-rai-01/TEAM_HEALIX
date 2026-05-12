import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, ChevronRight, Moon, Sun } from 'lucide-react';
import React, { useState } from 'react';

// Import Pages
import Dashboard from './pages/Dashboard';
import PatientsPage from './pages/PatientsPage';
import DoctorsPage from './pages/DoctorsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import BedsPage from './pages/BedsPage';
import PharmacyPage from './pages/PharmacyPage';
import LabPage from './pages/LabPage';
import BillingPage from './pages/BillingPage';
import ReportsPage from './pages/ReportsPage';
import SecurityPage from './pages/SecurityPage';
import DoctorPortal from './pages/DoctorPortal';
import AyurvedaHome from './pages/AyurvedaHome';
import CategoryPage from './pages/CategoryPage';
import ProductDetail from './pages/ProductDetail';

// Layout Component
function Layout({ children }) {
  const location = useLocation();
  const [isNight, setIsNight] = useState(false);

  const toggleTheme = (mode) => {
    if (mode === 'night') {
      setIsNight(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsNight(false);
      document.documentElement.classList.remove('dark');
    }
  };

  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <div className={`min-h-screen pb-10 transition-colors duration-300`}>
      <nav className="flex justify-between items-center px-10 py-6 bg-transparent w-full mb-4">
        <Link to="/" className="text-2xl font-black flex items-center gap-2 m-0 dark:text-white hover:opacity-80 transition">
          🏥 Soft Care
        </Link>
        <div className="hidden md:flex gap-6 items-center">
            <Link to="/ayurveda" className="text-sm font-bold text-slate-600 hover:text-emerald-600 dark:text-slate-300 transition flex items-center gap-2">
                🌿 Ayurveda & Wellness
            </Link>
        </div>
        <div className="flex gap-2 bg-white/20 p-1.5 rounded-full backdrop-blur-md border border-white/30 dark:bg-white/5">
          <button 
            onClick={() => toggleTheme('day')} 
            className={`px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${!isNight ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 dark:text-slate-400'}`}
          >
            Day
          </button>
          <button 
            onClick={() => toggleTheme('night')} 
            className={`px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${isNight ? 'bg-slate-800 text-white shadow-lg shadow-black' : 'text-slate-500 dark:text-slate-400'}`}
          >
            Night
          </button>
        </div>
      </nav>

      {/* Breadcrumb Navigation */}
      {location.pathname !== '/' && (
        <div className="max-w-6xl mx-auto px-6 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
            <Link to="/" className="hover:text-blue-600 flex items-center gap-1">
              <Home size={16} /> Dashboard
            </Link>
            {pathnames.map((name, index) => {
              const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
              const isLast = index === pathnames.length - 1;
              return (
                <React.Fragment key={name}>
                  <ChevronRight size={16} />
                  {isLast ? (
                    <span className="text-blue-600 capitalize">{name}</span>
                  ) : (
                    <Link to={routeTo} className="hover:text-blue-600 capitalize">
                      {name}
                    </Link>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/beds" element={<BedsPage />} />
        <Route path="/pharmacy" element={<PharmacyPage />} />
        <Route path="/lab" element={<LabPage />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/doctor-dashboard" element={<DoctorPortal />} />
        <Route path="/ayurveda" element={<AyurvedaHome />} />
        <Route path="/ayurveda/product/:id" element={<ProductDetail />} />
        <Route path="/ayurveda/:category" element={<CategoryPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
