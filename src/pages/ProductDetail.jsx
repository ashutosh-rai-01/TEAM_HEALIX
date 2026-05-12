import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Star, Shield, Leaf, Heart, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8888/api/ayurveda-products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="animate-pulse p-10 bg-white rounded-[2rem] border border-slate-100 flex flex-col md:flex-row gap-10">
      <div className="w-full md:w-1/2 h-96 bg-slate-100 rounded-2xl"></div>
      <div className="w-full md:w-1/2 space-y-4">
        <div className="h-4 bg-slate-100 rounded w-1/4"></div>
        <div className="h-8 bg-slate-100 rounded w-3/4"></div>
        <div className="h-20 bg-slate-100 rounded w-full"></div>
        <div className="h-10 bg-slate-100 rounded w-1/3"></div>
      </div>
    </div>
  );

  if (!product) return <div>Product Not Found</div>;

  return (
    <div className="animate-fade-in pb-10">
      <Link to="/ayurveda/all" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-emerald-600 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Products
      </Link>

      <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="w-full md:w-1/2 p-10 bg-slate-50 flex items-center justify-center relative">
          {product.discount > 0 && (
            <span className="absolute top-6 left-6 px-3 py-1.5 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg z-10 shadow-lg shadow-rose-200">
              {product.discount}% OFF
            </span>
          )}
          <img src={product.image} alt={product.name} className="w-full max-w-md object-contain mix-blend-multiply" />
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 p-10">
          <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2 border border-emerald-200 bg-emerald-50 inline-block px-3 py-1 rounded-full">
            {product.category}
          </div>
          
          <h1 className="text-3xl font-black text-slate-800 mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full">
              <Star className="text-amber-500 fill-amber-500" size={16} />
              <span className="text-sm font-bold text-amber-700">{product.rating}</span>
            </div>
            <span className="text-sm font-medium text-slate-400">{product.reviews} verified reviews</span>
          </div>

          <div className="flex items-end gap-3 mb-8">
            <span className="text-4xl font-black text-slate-800">₹{product.price}</span>
            {product.originalPrice && (
               <span className="text-lg text-slate-400 line-through font-medium mb-1.5">₹{product.originalPrice}</span>
            )}
            <span className="text-sm text-slate-400 font-medium mb-2">Inclusive of all taxes</span>
          </div>

          <div className="flex gap-4 mb-10">
            <button 
              onClick={() => setAdded(true)}
              className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {added ? <CheckCircle size={20} /> : <ShoppingCart size={20} />}
              {added ? 'Added to Cart' : 'Add to Cart'}
            </button>
            <button className="w-14 h-14 border-2 border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-100 hover:bg-rose-50 transition-all">
              <Heart size={24} />
            </button>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-2 gap-4 mb-10 py-6 border-y border-slate-100">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Leaf size={20}/></div>
               <div>
                 <div className="text-xs font-bold text-slate-800">100% Natural</div>
                 <div className="text-[10px] text-slate-500 uppercase tracking-wider">Ayurvedic</div>
               </div>
             </div>
             <div className="flex items-center gap-3">
               <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Shield size={20}/></div>
               <div>
                 <div className="text-xs font-bold text-slate-800">Quality Assured</div>
                 <div className="text-[10px] text-slate-500 uppercase tracking-wider">Tested</div>
               </div>
             </div>
          </div>

          {/* Details Tabs */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-2">Description</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{product.description}</p>
            </div>
            
            {product.benefits && product.benefits.length > 0 && (
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-3">Key Benefits</h3>
                <ul className="space-y-2">
                  {product.benefits.map((b, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-600">
                      <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.ingredients && (
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-2">Ingredients</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{product.ingredients}</p>
              </div>
            )}

            {product.usage && (
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-2">How to Use</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{product.usage}</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
