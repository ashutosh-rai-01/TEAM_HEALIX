const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

// ============================================================
//  HEALIX PHARMACY — Medicine Database (50+ products across 8 categories)
// ============================================================
const medicines = [
  // DIABETES
  { id: 1, name: "Accu-Chek Active Test Strips", category: "diabetes", price: 981, originalPrice: 1115, discount: 12, badge: "Bestseller", image: "https://cdn.1mg.com/uploads/medicine_image/Accu-Chek-Active.jpg" },
  { id: 2, name: "Ensure Diabetes Care Vanilla", category: "diabetes", price: 1852, originalPrice: 2105, discount: 12, badge: "Price Drop", image: "" },
  { id: 3, name: "Glycomet 500mg Tablets", category: "diabetes", price: 35, originalPrice: 42, discount: 17, badge: "Bestseller", image: "" },
  { id: 4, name: "Januvia 100mg Tablets", category: "diabetes", price: 2099, originalPrice: 2399, discount: 13, badge: null, image: "" },
  { id: 5, name: "Voglibose 0.3mg Tablets", category: "diabetes", price: 120, originalPrice: 145, discount: 17, badge: "Price Drop", image: "" },
  { id: 6, name: "Diabecon DS Himalaya", category: "diabetes", price: 175, originalPrice: 200, discount: 13, badge: null, image: "" },
  { id: 7, name: "Onetouch Select Plus Strips", category: "diabetes", price: 550, originalPrice: 660, discount: 17, badge: "Bestseller", image: "" },
  { id: 8, name: "Diastix Glucose Urine Strips", category: "diabetes", price: 320, originalPrice: 380, discount: 16, badge: null, image: "" },

  // CARDIAC
  { id: 9, name: "Atorvastatin 10mg Tablets", category: "cardiac", price: 98, originalPrice: 120, discount: 18, badge: "Bestseller", image: "" },
  { id: 10, name: "Ecosprin 75mg Aspirin", category: "cardiac", price: 18, originalPrice: 22, discount: 18, badge: "Bestseller", image: "" },
  { id: 11, name: "Amlodipine 5mg Tablets", category: "cardiac", price: 45, originalPrice: 55, discount: 18, badge: null, image: "" },
  { id: 12, name: "Carvedilol 6.25mg Tablets", category: "cardiac", price: 110, originalPrice: 135, discount: 19, badge: "Price Drop", image: "" },
  { id: 13, name: "Ramipril 5mg Capsules", category: "cardiac", price: 88, originalPrice: 105, discount: 16, badge: null, image: "" },
  { id: 14, name: "Olmesartan 20mg Tablets", category: "cardiac", price: 145, originalPrice: 172, discount: 16, badge: null, image: "" },
  { id: 15, name: "Trimetazidine 35mg SR", category: "cardiac", price: 210, originalPrice: 250, discount: 16, badge: "Price Drop", image: "" },

  // STOMACH
  { id: 16, name: "Omeprazole 20mg Capsules", category: "stomach", price: 48, originalPrice: 60, discount: 20, badge: "Bestseller", image: "" },
  { id: 17, name: "Pan D Capsules (10 strip)", category: "stomach", price: 155, originalPrice: 180, discount: 14, badge: "Bestseller", image: "" },
  { id: 18, name: "Dompan Domperidone 10mg", category: "stomach", price: 42, originalPrice: 52, discount: 19, badge: null, image: "" },
  { id: 19, name: "Liv.52 Himalaya (60 tabs)", category: "stomach", price: 145, originalPrice: 170, discount: 15, badge: "Price Drop", image: "" },
  { id: 20, name: "Cremalax Syrup 100ml", category: "stomach", price: 68, originalPrice: 82, discount: 17, badge: null, image: "" },
  { id: 21, name: "Digene Antacid Mint 200ml", category: "stomach", price: 105, originalPrice: 125, discount: 16, badge: "Bestseller", image: "" },
  { id: 22, name: "Rifaximin 550mg Tablets", category: "stomach", price: 680, originalPrice: 800, discount: 15, badge: null, image: "" },

  // PAIN
  { id: 23, name: "Ibuprofen 400mg Tablets", category: "pain", price: 25, originalPrice: 32, discount: 22, badge: "Bestseller", image: "" },
  { id: 24, name: "Diclofenac 50mg Tablets", category: "pain", price: 35, originalPrice: 44, discount: 20, badge: "Bestseller", image: "" },
  { id: 25, name: "Volini Pain Relief Gel 50g", category: "pain", price: 188, originalPrice: 225, discount: 16, badge: "Price Drop", image: "" },
  { id: 26, name: "Moov Strong Spray 80g", category: "pain", price: 212, originalPrice: 249, discount: 15, badge: "Bestseller", image: "" },
  { id: 27, name: "Combiflam Plus Tablets", category: "pain", price: 58, originalPrice: 70, discount: 17, badge: null, image: "" },
  { id: 28, name: "Ketorolac Eye Drops 5ml", category: "pain", price: 95, originalPrice: 115, discount: 17, badge: null, image: "" },
  { id: 29, name: "Tramadol 50mg Capsules", category: "pain", price: 198, originalPrice: 240, discount: 18, badge: "Price Drop", image: "" },

  // RESPIRATORY
  { id: 30, name: "Levolin Inhaler 100mcg", category: "respiratory", price: 145, originalPrice: 175, discount: 17, badge: "Bestseller", image: "" },
  { id: 31, name: "Seroflo 250 Rotacaps", category: "respiratory", price: 890, originalPrice: 1050, discount: 15, badge: null, image: "" },
  { id: 32, name: "Montelukast 10mg Tablets", category: "respiratory", price: 148, originalPrice: 180, discount: 18, badge: "Bestseller", image: "" },
  { id: 33, name: "Budecort 0.5mg Respules", category: "respiratory", price: 320, originalPrice: 385, discount: 17, badge: "Price Drop", image: "" },
  { id: 34, name: "Tiotropium 18mcg Capsule", category: "respiratory", price: 560, originalPrice: 670, discount: 16, badge: null, image: "" },
  { id: 35, name: "Asthalin 100mcg Inhaler", category: "respiratory", price: 98, originalPrice: 118, discount: 17, badge: "Bestseller", image: "" },

  // COLD
  { id: 36, name: "Cheston Cold Tablets", category: "cold", price: 55, originalPrice: 68, discount: 19, badge: "Bestseller", image: "" },
  { id: 37, name: "Zincovit Multivitamin", category: "cold", price: 188, originalPrice: 225, discount: 16, badge: "Price Drop", image: "" },
  { id: 38, name: "D-Cold Total Tablets", category: "cold", price: 42, originalPrice: 52, discount: 19, badge: null, image: "" },
  { id: 39, name: "Vitamin C 1000mg ZenVita", category: "cold", price: 299, originalPrice: 360, discount: 17, badge: "Bestseller", image: "" },
  { id: 40, name: "Nasivion Nasal Drops 10ml", category: "cold", price: 75, originalPrice: 92, discount: 18, badge: null, image: "" },
  { id: 41, name: "Himalaya Septilin Syrup", category: "cold", price: 130, originalPrice: 155, discount: 16, badge: "Price Drop", image: "" },

  // LIVER
  { id: 42, name: "Silymarin 140mg Tablets", category: "liver", price: 220, originalPrice: 265, discount: 17, badge: "Bestseller", image: "" },
  { id: 43, name: "Ursodiol 300mg Capsules", category: "liver", price: 480, originalPrice: 575, discount: 17, badge: null, image: "" },
  { id: 44, name: "Hepamerz Granules 5g", category: "liver", price: 860, originalPrice: 1020, discount: 16, badge: "Price Drop", image: "" },
  { id: 45, name: "Silymarin Forte 140mg", category: "liver", price: 350, originalPrice: 420, discount: 17, badge: null, image: "" },
  { id: 46, name: "Udiliv 300 Tablets", category: "liver", price: 320, originalPrice: 385, discount: 17, badge: "Bestseller", image: "" },

  // VITAMINS (Ayurveda catch-all)
  { id: 47, name: "Ashwagandha 500mg Tabs", category: "ayurveda", price: 360, originalPrice: 430, discount: 16, badge: "Bestseller", image: "" },
  { id: 48, name: "Triphala Churna 100g", category: "ayurveda", price: 88, originalPrice: 105, discount: 16, badge: null, image: "" },
  { id: 49, name: "Shilajit Resin 20g", category: "ayurveda", price: 680, originalPrice: 820, discount: 17, badge: "Price Drop", image: "" },
  { id: 50, name: "Brahmi Capsules 60", category: "ayurveda", price: 240, originalPrice: 290, discount: 17, badge: "Bestseller", image: "" },
];

// Default medicine image by category
const categoryImages = {
  diabetes: "https://onemg.gumlet.io/l_watermark_346,w_120,h_120/a_ignore,w_380,h_380,c_fit,q_auto,f_auto/6e6de9a5aa204a3f8c990beb666d0023.jpg",
  cardiac: "https://onemg.gumlet.io/l_watermark_346,w_120,h_120/a_ignore,w_380,h_380,c_fit,q_auto,f_auto/2e74b4fa6bb14b899c19b31e3bc72da3.jpg",
  stomach: "https://onemg.gumlet.io/l_watermark_346,w_120,h_120/a_ignore,w_380,h_380,c_fit,q_auto,f_auto/f5ddc38d47ed4a689e6e3d2c7f87c88b.jpg",
  pain: "https://onemg.gumlet.io/l_watermark_346,w_120,h_120/a_ignore,w_380,h_380,c_fit,q_auto,f_auto/a95e5a5c61ef4c9c9f3fa3dc19af3820.jpg",
  respiratory: "https://onemg.gumlet.io/l_watermark_346,w_120,h_120/a_ignore,w_380,h_380,c_fit,q_auto,f_auto/a7c0f32e0c9e48e59c3b8b39b5d12b99.jpg",
  cold: "https://onemg.gumlet.io/l_watermark_346,w_120,h_120/a_ignore,w_380,h_380,c_fit,q_auto,f_auto/2ba9c59b9d4c4d14a5e3a39b6d8c1177.jpg",
  liver: "https://onemg.gumlet.io/l_watermark_346,w_120,h_120/a_ignore,w_380,h_380,c_fit,q_auto,f_auto/cdb28a083c9241fb9e6aedf78d2e9dd9.jpg",
  ayurveda: "https://onemg.gumlet.io/l_watermark_346,w_120,h_120/a_ignore,w_380,h_380,c_fit,q_auto,f_auto/a487e86bb5d24e829e8c3d286af38b11.jpg",
};

// GET /api/medicines — filter + sort
app.get("/api/medicines", (req, res) => {
  const { category, sort, location } = req.query;

  let results = category
    ? medicines.filter(m => m.category.toLowerCase() === category.toLowerCase())
    : medicines;

  if (sort === "low") results = [...results].sort((a, b) => a.price - b.price);
  if (sort === "high") results = [...results].sort((a, b) => b.price - a.price);
  if (sort === "discount") results = [...results].sort((a, b) => b.discount - a.discount);

  // Attach default image
  results = results.map(m => ({
    ...m,
    image: m.image || categoryImages[m.category] ||
      `https://placehold.co/300x300/EEF2FF/2563EB?text=${encodeURIComponent(m.name.slice(0,12))}`
  }));

  // Log location for analytics (optional)
  if (location) console.log(`📍 Medicines requested from: ${location}`);

  res.json(results);
});

// GET /api/categories
app.get("/api/categories", (req, res) => {
  const cats = [...new Set(medicines.map(m => m.category))];
  res.json(cats);
});

// ── LOCATION STORAGE ──────────────────────────────────────
let sessionLocation = { city: '', state: '' }; // in-memory (replace with MongoDB for prod)

app.get("/api/location", (req, res) => {
  res.json(sessionLocation);
});

app.post("/api/location", (req, res) => {
  const { city, state } = req.body;
  if (!city) return res.status(400).json({ error: 'city is required' });
  sessionLocation = { city, state: state || '' };
  console.log(`📍 Location saved: ${city}, ${state || ''}`);
  res.json({ success: true, location: sessionLocation });
});

const PORT = 8888;
app.listen(PORT, () => {
  console.log(`✅ HEALIX Pharmacy Backend running → http://localhost:${PORT}`);
  console.log(`   API: http://localhost:${PORT}/api/medicines?category=diabetes`);
});
