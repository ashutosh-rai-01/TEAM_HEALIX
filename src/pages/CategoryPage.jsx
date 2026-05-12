import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, Filter, ShoppingCart, Star } from 'lucide-react';

export default function CategoryPage() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState('');
  const [minRating, setMinRating] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [category, sort, minRating]);

  const fetchProducts = () => {
    setLoading(true);
    let url = `http://localhost:8888/api/ayurveda-products?`;
    if (category !== 'all') url += `category=${category}&`;
    if (searchTerm) url += `search=${searchTerm}&`;
    if (sort) url += `sort=${sort}&`;
    if (minRating) url += `minRating=${minRating}&`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 capitalize">
            {category === 'all' ? 'All Ayurveda Products' : `${category} Wellness`}
          </h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">
            {products.length} Products Found
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <form onSubmit={handleSearch} className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl w-full text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </form>
          
          <select 
            value={sort} 
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
          >
            <option value="">Sort By: Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="discount">Best Discount</option>
          </select>

          <select 
            value={minRating} 
            onChange={(e) => setMinRating(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
          >
            <option value="">Any Rating</option>
            <option value="4">4★ & Above</option>
            <option value="4.5">4.5★ & Above</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => (
             <div key={i} className="bg-white rounded-[2rem] p-4 h-80 animate-pulse border border-slate-100">
               <div className="w-full h-40 bg-slate-100 rounded-2xl mb-4"></div>
               <div className="h-4 bg-slate-100 rounded w-1/3 mb-2"></div>
               <div className="h-6 bg-slate-100 rounded w-3/4 mb-4"></div>
               <div className="h-10 bg-slate-100 rounded-xl mt-auto"></div>
             </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100">
           <Filter className="mx-auto text-slate-300 mb-4" size={48} />
           <h3 className="text-xl font-bold text-slate-800">No products found</h3>
           <p className="text-slate-500 mt-2">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-[2rem] border border-slate-100 p-4 hover:shadow-xl hover:shadow-emerald-900/5 transition-all group flex flex-col h-full">
              <Link to={`/ayurveda/product/${product.id}`} className="block relative rounded-2xl overflow-hidden bg-slate-50 aspect-square mb-4">
                {product.discount > 0 && (
                  <span className="absolute top-3 left-3 px-2 py-1 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg z-10">
                    {product.discount}% OFF
                  </span>
                )}
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </Link>
              
              <div className="flex-1 flex flex-col">
                <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">{product.category}</div>
                <Link to={`/ayurveda/product/${product.id}`} className="font-bold text-slate-800 mb-2 line-clamp-2 hover:text-emerald-600 transition-colors">
                  {product.name}
                </Link>
                
                <div className="flex items-center gap-1 mb-4">
                  <Star className="text-amber-400 fill-amber-400" size={14} />
                  <span className="text-sm font-bold text-slate-700">{product.rating}</span>
                  <span className="text-xs text-slate-400">({product.reviews})</span>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                  <div>
                    {product.originalPrice && (
                      <div className="text-xs text-slate-400 line-through font-medium">₹{product.originalPrice}</div>
                    )}
                    <div className="text-lg font-black text-slate-800">₹{product.price}</div>
                  </div>
                  <button className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors">
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
