import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Shield, Droplet, Wind, Coffee, TrendingUp, ChevronRight } from 'lucide-react';

const categories = [
  { name: 'Immunity Boosters', id: 'immunity', icon: Shield, color: 'bg-orange-50 text-orange-600', hover: 'hover:bg-orange-100 border-orange-200' },
  { name: 'Herbal Supplements', id: 'herbal', icon: Leaf, color: 'bg-emerald-50 text-emerald-600', hover: 'hover:bg-emerald-100 border-emerald-200' },
  { name: 'Skin Care', id: 'skin', icon: Droplet, color: 'bg-rose-50 text-rose-600', hover: 'hover:bg-rose-100 border-rose-200' },
  { name: 'Hair Care', id: 'hair', icon: Wind, color: 'bg-purple-50 text-purple-600', hover: 'hover:bg-purple-100 border-purple-200' },
  { name: 'Digestive Health', id: 'digestive', icon: Coffee, color: 'bg-amber-50 text-amber-600', hover: 'hover:bg-amber-100 border-amber-200' },
];

export default function AyurvedaHome() {
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8888/api/ayurveda-products?sort=popular')
      .then(res => res.json())
      .then(data => setTrending(data.slice(0, 4)))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="animate-fade-in pb-10">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 rounded-[2rem] p-10 mb-10 text-white shadow-xl shadow-emerald-900/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 max-w-2xl">
          <span className="px-4 py-1.5 rounded-full bg-emerald-500/30 border border-emerald-400/30 text-emerald-50 text-[10px] font-black uppercase tracking-widest backdrop-blur-md inline-block mb-4">
            🌿 100% Natural Wellness
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
            Discover the Power of Ayurveda
          </h1>
          <p className="text-emerald-100 font-medium mb-8 text-lg">
            Authentic, safe, and effective Ayurvedic remedies for your holistic wellbeing.
          </p>
          <Link to="/ayurveda/all" className="inline-flex items-center gap-2 bg-white text-emerald-800 px-8 py-4 rounded-2xl font-bold hover:bg-emerald-50 hover:scale-105 transition-all shadow-lg hover:shadow-xl">
            Shop All Products <ChevronRight size={18} />
          </Link>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-12">
        <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
          Shop by Concern
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <Link key={cat.id} to={`/ayurveda/${cat.id}`} className={`p-6 rounded-[2rem] border transition-all flex flex-col items-center text-center gap-4 group ${cat.color} ${cat.hover}`}>
                <div className={`p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform`}>
                  <Icon size={28} />
                </div>
                <h3 className="font-bold text-slate-700">{cat.name}</h3>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Trending Section */}
      <div>
        <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
          <TrendingUp className="text-emerald-600" /> Trending in Ayurveda
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {trending.map(product => (
            <div key={product.id} className="bg-white rounded-[2rem] border border-slate-100 p-4 hover:shadow-xl hover:shadow-emerald-900/5 transition-all group flex flex-col h-full">
              <div className="relative rounded-2xl overflow-hidden bg-slate-50 aspect-square mb-4">
                {product.badge && (
                  <span className="absolute top-3 left-3 px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg z-10 shadow-sm">
                    {product.badge}
                  </span>
                )}
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex-1 flex flex-col">
                <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">{product.category}</div>
                <h3 className="font-bold text-slate-800 mb-2 line-clamp-2 leading-tight">{product.name}</h3>
                
                <div className="flex items-center gap-1 mb-4 pt-1">
                  <span className="text-amber-400">★</span>
                  <span className="text-sm font-bold text-slate-700">{product.rating}</span>
                  <span className="text-xs text-slate-400 font-medium">({product.reviews})</span>
                </div>

                <div className="mt-auto flex items-end justify-between pt-4 border-t border-slate-50">
                  <div>
                    <div className="text-xs text-slate-400 line-through font-medium">₹{product.originalPrice}</div>
                    <div className="text-lg font-black text-slate-800">₹{product.price}</div>
                  </div>
                  <Link to={`/ayurveda/product/${product.id}`} className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-sm hover:bg-emerald-600 hover:text-white transition-colors">
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
