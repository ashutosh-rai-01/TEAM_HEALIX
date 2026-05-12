import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 8888; 

app.use(cors());
app.use(express.json());

const JSON_FILE = path.join(__dirname, 'pharmacy_data.json');
function getJSON() {
    if (!fs.existsSync(JSON_FILE)) fs.writeFileSync(JSON_FILE, JSON.stringify({ medicines: [], orders: [] }));
    return JSON.parse(fs.readFileSync(JSON_FILE));
}
function saveJSON(data) { fs.writeFileSync(JSON_FILE, JSON.stringify(data, null, 2)); }

function seedLocal() {
    const data = getJSON();
    if (data.medicines.length === 0) {
        const rawData = {
          "Diabetes": [
            { "name": "Gluconorm Tablet", "brand": "Lupin", "price": 120, "rating": 4.3 },
            { "name": "Metformin Tablet", "brand": "Sun Pharma", "price": 80, "rating": 4.5 },
            { "name": "Amaryl Tablet", "brand": "Sanofi", "price": 150, "rating": 4.4 },
            { "name": "Diabecon DS", "brand": "Himalaya", "price": 180, "rating": 4.2 },
            { "name": "Glycomet GP", "brand": "USV", "price": 140, "rating": 4.3 },
            { "name": "Insulin Injection", "brand": "Novo Nordisk", "price": 600, "rating": 4.6 },
            { "name": "Voglibose Tablet", "brand": "Zydus", "price": 130, "rating": 4.1 },
            { "name": "Janumet Tablet", "brand": "MSD", "price": 220, "rating": 4.5 },
            { "name": "Diabeta Tablet", "brand": "USV", "price": 110, "rating": 4.2 },
            { "name": "Ayush 82", "brand": "Charak", "price": 160, "rating": 4.0 }
          ],
          "Cardiac": [
            { "name": "Ecosprin Tablet", "brand": "USV", "price": 50, "rating": 4.5 },
            { "name": "Atorva Tablet", "brand": "Zydus", "price": 140, "rating": 4.4 },
            { "name": "Cardace Tablet", "brand": "Sanofi", "price": 170, "rating": 4.3 },
            { "name": "Telma Tablet", "brand": "Glenmark", "price": 130, "rating": 4.2 },
            { "name": "Clopidogrel Tablet", "brand": "Sun Pharma", "price": 90, "rating": 4.4 },
            { "name": "Rosuvas Tablet", "brand": "Sun Pharma", "price": 160, "rating": 4.5 },
            { "name": "Amlodipine Tablet", "brand": "Cipla", "price": 60, "rating": 4.3 },
            { "name": "Betaloc Tablet", "brand": "AstraZeneca", "price": 180, "rating": 4.2 },
            { "name": "Losartan Tablet", "brand": "Torrent", "price": 100, "rating": 4.3 },
            { "name": "Arjuna Capsules", "brand": "Himalaya", "price": 120, "rating": 4.1 }
          ],
          "Stomach": [
            { "name": "Digene Tablet", "brand": "Abbott", "price": 90, "rating": 4.4 },
            { "name": "ENO Powder", "brand": "GSK", "price": 60, "rating": 4.5 },
            { "name": "Gelusil Syrup", "brand": "Pfizer", "price": 110, "rating": 4.3 },
            { "name": "Pan D Capsule", "brand": "Alkem", "price": 120, "rating": 4.2 },
            { "name": "Cremaffin Syrup", "brand": "Abbott", "price": 140, "rating": 4.3 },
            { "name": "Hajmola Tablets", "brand": "Dabur", "price": 50, "rating": 4.6 },
            { "name": "Pudin Hara", "brand": "Dabur", "price": 40, "rating": 4.5 },
            { "name": "Liv 52", "brand": "Himalaya", "price": 130, "rating": 4.4 },
            { "name": "Rantac Tablet", "brand": "JB Chemicals", "price": 70, "rating": 4.2 },
            { "name": "Omeprazole Capsule", "brand": "Cipla", "price": 80, "rating": 4.3 }
          ],
          "Pain": [
            { "name": "Crocin Tablet", "brand": "GSK", "price": 40, "rating": 4.6 },
            { "name": "Brufen Tablet", "brand": "Abbott", "price": 60, "rating": 4.5 },
            { "name": "Combiflam", "brand": "Sanofi", "price": 70, "rating": 4.6 },
            { "name": "Volini Gel", "brand": "Sun Pharma", "price": 120, "rating": 4.4 },
            { "name": "Moov Spray", "brand": "Reckitt", "price": 150, "rating": 4.3 },
            { "name": "Dolo 650", "brand": "Micro Labs", "price": 35, "rating": 4.7 },
            { "name": "Aceclofenac Tablet", "brand": "Cipla", "price": 90, "rating": 4.3 },
            { "name": "Voveran Tablet", "brand": "Novartis", "price": 110, "rating": 4.2 },
            { "name": "Nise Tablet", "brand": "Dr Reddy's", "price": 85, "rating": 4.1 },
            { "name": "Zerodol Tablet", "brand": "Ipca", "price": 95, "rating": 4.3 }
          ],
          "Respiratory": [
            { "name": "Asthalin Inhaler", "brand": "Cipla", "price": 180, "rating": 4.5 },
            { "name": "Budecort Inhaler", "brand": "Cipla", "price": 300, "rating": 4.4 },
            { "name": "Montair Tablet", "brand": "Cipla", "price": 150, "rating": 4.3 },
            { "name": "Ascoril Syrup", "brand": "Glenmark", "price": 120, "rating": 4.4 },
            { "name": "Benadryl Syrup", "brand": "J&J", "price": 140, "rating": 4.3 },
            { "name": "Sinarest Tablet", "brand": "Centaur", "price": 80, "rating": 4.2 },
            { "name": "Cetirizine Tablet", "brand": "Sun Pharma", "price": 50, "rating": 4.3 },
            { "name": "Levolin Inhaler", "brand": "Cipla", "price": 200, "rating": 4.4 },
            { "name": "Allegra Tablet", "brand": "Sanofi", "price": 170, "rating": 4.5 },
            { "name": "Karvol Plus", "brand": "Karvol", "price": 60, "rating": 4.2 }
          ],
          "Vitamins": [
            { "name": "Limcee Tablet", "brand": "Abbott", "price": 50, "rating": 4.6 },
            { "name": "Zincovit Tablet", "brand": "Apex", "price": 90, "rating": 4.5 },
            { "name": "Revital H", "brand": "Sun Pharma", "price": 300, "rating": 4.4 },
            { "name": "Supradyn Tablet", "brand": "Bayer", "price": 120, "rating": 4.5 },
            { "name": "Chyawanprash", "brand": "Dabur", "price": 350, "rating": 4.6 },
            { "name": "Septilin Tablet", "brand": "Himalaya", "price": 140, "rating": 4.3 },
            { "name": "Amla Juice", "brand": "Patanjali", "price": 200, "rating": 4.2 },
            { "name": "Vitamin D3 Capsule", "brand": "Uprise", "price": 80, "rating": 4.4 },
            { "name": "Ashwagandha Tablet", "brand": "Himalaya", "price": 160, "rating": 4.3 },
            { "name": "Giloy Juice", "brand": "Baidyanath", "price": 180, "rating": 4.2 }
          ],
          "Cold": [
            { "name": "Limcee Tablet", "brand": "Abbott", "price": 50, "rating": 4.6 },
            { "name": "Zincovit Tablet", "brand": "Apex", "price": 90, "rating": 4.5 },
            { "name": "Vicks Vaporub 50g", "brand": "P&G", "price": 155, "rating": 4.7 },
            { "name": "Cebion Vitamin C", "brand": "Merck", "price": 120, "rating": 4.5 },
            { "name": "Chyawanprash", "brand": "Dabur", "price": 350, "rating": 4.6 },
            { "name": "Septilin Tablet", "brand": "Himalaya", "price": 140, "rating": 4.3 },
            { "name": "Amla Juice", "brand": "Patanjali", "price": 200, "rating": 4.2 },
            { "name": "Koflet Syrup", "brand": "Himalaya", "price": 95, "rating": 4.5 },
            { "name": "Ashwagandha Tablet", "brand": "Himalaya", "price": 160, "rating": 4.3 },
            { "name": "Giloy Juice", "brand": "Baidyanath", "price": 180, "rating": 4.2 }
          ],
          "Liver": [
            { "name": "Liv 52 DS", "brand": "Himalaya", "price": 150, "rating": 4.5 },
            { "name": "Silybon Tablet", "brand": "Micro Labs", "price": 180, "rating": 4.4 },
            { "name": "Udiliv Tablet", "brand": "Abbott", "price": 220, "rating": 4.3 },
            { "name": "Hepamerz Powder", "brand": "Win-Medicare", "price": 300, "rating": 4.4 },
            { "name": "Liveril Syrup", "brand": "Cipla", "price": 140, "rating": 4.2 },
            { "name": "Silymarin Capsule", "brand": "Zydus", "price": 160, "rating": 4.3 },
            { "name": "Livomyn Syrup", "brand": "Charak", "price": 130, "rating": 4.2 },
            { "name": "Kutki Tablets", "brand": "Himalaya", "price": 120, "rating": 4.1 },
            { "name": "Phyllanthus Niruri", "brand": "Organic India", "price": 200, "rating": 4.3 },
            { "name": "Liver Tonic", "brand": "Baidyanath", "price": 110, "rating": 4.2 }
          ],
          "Ayurveda": [
            { "name": "Ashwagandha Capsule", "brand": "Himalaya", "price": 160, "rating": 4.5 },
            { "name": "Triphala Tablet", "brand": "Baidyanath", "price": 120, "rating": 4.4 },
            { "name": "Giloy Juice", "brand": "Patanjali", "price": 180, "rating": 4.3 },
            { "name": "Tulsi Drops", "brand": "Organic India", "price": 150, "rating": 4.4 },
            { "name": "Chyawanprash", "brand": "Dabur", "price": 350, "rating": 4.6 },
            { "name": "Neem Tablets", "brand": "Himalaya", "price": 110, "rating": 4.3 },
            { "name": "Amla Juice", "brand": "Patanjali", "price": 200, "rating": 4.2 },
            { "name": "Brahmi Tablet", "brand": "Himalaya", "price": 140, "rating": 4.3 },
            { "name": "Shilajit Capsule", "brand": "Dabur", "price": 300, "rating": 4.4 },
            { "name": "Aloe Vera Juice", "brand": "Baidyanath", "price": 180, "rating": 4.2 }
          ]
        };

        const stockImages = [
            "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1626716493137-b67fe955f581?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1550572017-ed200159d5c4?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1615461066841-6116ecaaba7d?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1576671081837-49000a6f0590?w=400&h=400&fit=crop"
        ];

        let medicines = [];
        Object.entries(rawData).forEach(([cat, items], catIdx) => {
            items.forEach((item, idx) => {
                medicines.push({
                    id: `${cat.slice(0,1).toLowerCase()}${idx + 1}`,
                    name: item.name,
                    price: item.price,
                    originalPrice: Math.round(item.price * 1.25),
                    discount: 20,
                    stock: 100,
                    category: cat,
                    rating: item.rating,
                    badge: item.brand,
                    image: stockImages[(catIdx + idx) % stockImages.length]
                });
            });
        });
        
        data.medicines = medicines;
        saveJSON(data);
    }
}

let isMongo = false;
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/healix_db')
    .then(() => { console.log('✅ MongoDB Connected'); isMongo = true; })
    .catch(() => { console.log('⚠️ Using Fresh JSON Fallback'); });

// Always ensure the local JSON is seeded because the /api/medicines endpoint relies on it.
seedLocal();

app.get('/api/medicines', async (req, res) => {
    try {
        const { category } = req.query;
        let meds = getJSON().medicines || [];
        
        if (category) {
            const query = category.toLowerCase();
            meds = meds.filter(m => 
                m.category.toLowerCase() === query || 
                m.category.toLowerCase().startsWith(query) ||
                query.includes(m.category.toLowerCase())
            );
        }
        
        // Ensure all required fields exist for frontend rendering
        const sanitizedMeds = meds.map(m => ({
            ...m,
            id: m.id || Math.random().toString(36).substr(2, 9),
            originalPrice: m.originalPrice || m.price || 0,
            discount: m.discount || 0
        }));
        
        res.json(sanitizedMeds);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── LOCATION API ──────────────────────────────────────────────────────────
const LOCATION_FILE = path.join(__dirname, 'location_data.json');
function getLocationData() {
    if (!fs.existsSync(LOCATION_FILE)) fs.writeFileSync(LOCATION_FILE, JSON.stringify({ city: '', state: '' }));
    return JSON.parse(fs.readFileSync(LOCATION_FILE));
}
function saveLocationData(data) { fs.writeFileSync(LOCATION_FILE, JSON.stringify(data, null, 2)); }

app.post('/api/location', (req, res) => {
    const { city, state } = req.body;
    if (!city) return res.status(400).json({ error: 'City is required' });
    const loc = { city, state: state || '', savedAt: new Date().toISOString() };
    saveLocationData(loc);
    res.json({ success: true, ...loc });
});

app.get('/api/location', (req, res) => {
    const data = getLocationData();
    res.json(data);
});

// ── AYURVEDA PRODUCTS API ──────────────────────────────────────────────────

const AYURVEDA_PRODUCTS = [
  // ── IMMUNITY BOOSTERS ──
  { id: 'ay001', name: 'Himalaya Ashwagandha Tablets', category: 'immunity', price: 199, originalPrice: 299, discount: 33, rating: 4.7, reviews: 2841, badge: 'Bestseller', image: 'https://www.netmeds.com/images/product-v1/600x600/15910/himalaya_ashvagandha_tablet_60_s_0.jpg', description: 'Ashwagandha (Withania somnifera) is an ancient medicinal herb classified as an adaptogen, meaning it can help your body manage stress.', ingredients: 'Ashwagandha root extract, Microcrystalline cellulose, Crospovidone', benefits: ['Boosts immunity naturally', 'Reduces stress & anxiety', 'Improves energy and vitality', 'Enhances physical endurance', 'Supports hormonal balance'], usage: 'Take 1 tablet twice daily after meals with warm milk or as directed by physician.' },
  { id: 'ay002', name: 'Dabur Chyawanprash 1kg', category: 'immunity', price: 349, originalPrice: 399, discount: 13, rating: 4.8, reviews: 5621, badge: 'Bestseller', image: 'https://www.netmeds.com/images/product-v1/600x600/15879/dabur_chyawanprash_1_kg_0.jpg', description: 'Dabur Chyawanprash is India\'s No.1 Immunity Booster with 41 natural herbs and Amla rich in Vitamin C.', ingredients: 'Amla, Bala, Ashwagandha, Giloy, 41+ natural herbs', benefits: ['3x immunity boost', 'Protects from cold & cough', 'Keeps heart healthy', 'Improves memory & learning', 'Rich in Vitamin C'], usage: 'Adults: 1-2 teaspoons daily with warm milk. Children: 1 teaspoon daily.' },
  { id: 'ay003', name: 'Baidyanath Giloy Juice 1L', category: 'immunity', price: 179, originalPrice: 250, discount: 28, rating: 4.5, reviews: 1234, badge: null, image: 'https://www.netmeds.com/images/product-v1/600x600/849736/baidyanath_giloy_juice_1_litre_0.jpg', description: 'Giloy (Tinospora cordifolia) is a powerful immunity herb known as "Amrita" or the root of immortality in Ayurveda.', ingredients: 'Giloy stem extract (100%), Preservatives: Sodium benzoate', benefits: ['Boosts immunity', 'Detoxifies blood', 'Regulates blood sugar', 'Anti-inflammatory properties', 'Improves digestion'], usage: '30ml twice daily mixed in a glass of water on empty stomach.' },
  { id: 'ay004', name: 'Organic India Tulsi Drop 30ml', category: 'immunity', price: 249, originalPrice: 300, discount: 17, rating: 4.6, reviews: 891, badge: 'Organic', image: 'https://www.netmeds.com/images/product-v1/600x600/1010291/organic_india_tulsi_drop_30_ml_0.jpg', description: 'Holy Basil drops combining 5 varieties of Tulsi for maximum adaptogenic benefit.', ingredients: 'Vana Tulsi, Rama Tulsi, Krishna Tulsi, Shyama Tulsi, Kapoor Tulsi', benefits: ['Powerful adaptogen', 'Supports respiratory health', 'Anti-stress formula', 'Rich in antioxidants', 'Supports healthy digestion'], usage: '2-3 drops in water or tea twice daily.' },

  // ── HERBAL SUPPLEMENTS ──
  { id: 'ay005', name: 'Patanjali Triphala Churna 100g', category: 'herbal', price: 79, originalPrice: 99, discount: 20, rating: 4.4, reviews: 3201, badge: 'Popular', image: 'https://www.netmeds.com/images/product-v1/600x600/409715/patanjali_triphala_churna_100gm_0.jpg', description: 'Triphala is a classic Ayurvedic formulation containing three fruits: Amalaki, Bibhitaki, and Haritaki.', ingredients: 'Amalaki (Emblica officinalis), Bibhitaki (Terminalia bellirica), Haritaki (Terminalia chebula)', benefits: ['Natural laxative & detox', 'Improves bowel movement', 'Rich in antioxidants', 'Promotes eye health', 'Anti-aging properties'], usage: '1 teaspoon with warm water before bed.' },
  { id: 'ay006', name: 'Himalaya Brahmi Mind Wellness', category: 'herbal', price: 159, originalPrice: 199, discount: 20, rating: 4.6, reviews: 1876, badge: null, image: 'https://www.netmeds.com/images/product-v1/600x600/15923/himalaya_brahmi_tablet_60_s_0.jpg', description: 'Brahmi promotes intellectual capacity and relieves anxiety helping you achieve a calm, focused mind.', ingredients: 'Brahmi (Bacopa monnieri) 250mg, Excipients', benefits: ['Enhances memory & learning', 'Reduces anxiety and stress', 'Improves concentration', 'Neuroprotective properties', 'Calms the mind'], usage: 'Take 1 tablet twice daily after meals.' },
  { id: 'ay007', name: 'Shatavari Capsules 60s', category: 'herbal', price: 299, originalPrice: 399, discount: 25, rating: 4.7, reviews: 1102, badge: "Women's Health", image: 'https://www.netmeds.com/images/product-v1/600x600/15932/himalaya_shatavari_tablet_60_s_0.jpg', description: 'Shatavari is the quintessential female tonic in Ayurveda, revered for its ability to support hormonal balance.', ingredients: 'Shatavari root extract (Asparagus racemosus) 250mg', benefits: ['Supports female hormonal health', 'Boosts lactation in nursing mothers', 'Reduces menopausal symptoms', 'Improves reproductive health', 'Adaptogenic properties'], usage: '1 capsule twice daily with warm milk or water after meals.' },
  { id: 'ay008', name: 'Moringa Powder Organic 200g', category: 'herbal', price: 329, originalPrice: 450, discount: 27, rating: 4.5, reviews: 743, badge: 'Organic', image: 'https://images.unsplash.com/photo-1624454002302-36b824d7bd0a?w=400&h=400&fit=crop', description: 'Pure organic Moringa leaf powder, the "miracle tree" packed with 92 nutrients and 46 antioxidants.', ingredients: 'Moringa oleifera leaf powder 100% organic', benefits: ['Rich in iron & calcium', '2x protein vs yogurt', '7x Vitamin C of oranges', 'Supports energy all day', 'Natural blood sugar support'], usage: '1 teaspoon daily mixed in smoothies, juices, or warm water.' },
  { id: 'ay009', name: 'Neem Karela Jamun Juice 1L', category: 'herbal', price: 199, originalPrice: 270, discount: 26, rating: 4.3, reviews: 2109, badge: null, image: 'https://www.netmeds.com/images/product-v1/600x600/850049/kapiva_neem_karela_jamun_juice_1_l_0.jpg', description: 'A powerful blend of Neem, Karela and Jamun that helps manage blood sugar and improve metabolism.', ingredients: 'Neem leaf juice, Karela juice, Jamun seed extract', benefits: ['Controls blood sugar naturally', 'Purifies blood', 'Supports liver health', 'Boosts metabolism', 'Anti-diabetic properties'], usage: '30ml twice daily on empty stomach mixed with equal water.' },

  // ── SKIN CARE ──
  { id: 'ay010', name: 'Kama Ayurveda Rose Jasmine Face Oil', category: 'skin', price: 595, originalPrice: 695, discount: 14, rating: 4.8, reviews: 2341, badge: 'Premium', image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400&h=400&fit=crop', description: 'A luxurious blend of pure Rose and Jasmine oils that deeply nourish, tone and hydrate the skin.', ingredients: 'Damask Rose oil, Jasmine absolute, Almond oil, Vitamin E', benefits: ['Intensely hydrates dry skin', 'Reduces fine lines & wrinkles', 'Evens skin tone naturally', 'Aromatherapy benefits', 'Suitable for all skin types'], usage: 'Apply 3-4 drops on clean face and neck each night before bed.' },
  { id: 'ay011', name: 'Himalaya Neem Face Wash 150ml', category: 'skin', price: 175, originalPrice: 199, discount: 12, rating: 4.5, reviews: 7892, badge: 'Bestseller', image: 'https://www.netmeds.com/images/product-v1/600x600/15910/himalaya_purifying_neem_face_wash_150_ml_0_0.jpg', description: 'Purifying face wash with Neem and Turmeric that fights pimples and keeps skin clear.', ingredients: 'Neem leaf extract, Turmeric extract, Aloe Vera, Zinc', benefits: ['Removes excess oil', 'Fights acne and pimples', 'Soothes skin irritation', 'Deep pore cleansing', 'Reduces blemishes'], usage: 'Apply on wet face, gently massage, rinse. Use morning and night.' },
  { id: 'ay012', name: 'Forest Essentials Almond & Rose Body Oil', category: 'skin', price: 1495, originalPrice: 1795, discount: 17, rating: 4.9, reviews: 1021, badge: 'Luxury', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop', description: 'Indulge in this precious Ayurvedic body oil blend for silky, nourished skin.', ingredients: 'Sweet Almond oil, Rosa Damascena (Rose), Vetiver, Jasmine, Pure Gold Bhasma', benefits: ['Deep moisturization', 'Radiant glowing skin', 'Reduces stretch marks', 'Anti-aging properties', 'Luxurious Ayurvedic parabens-free formula'], usage: 'Warm between palms and massage into damp skin post-shower.' },
  { id: 'ay013', name: 'Biotique Bio Papaya Face Pack 75g', category: 'skin', price: 149, originalPrice: 199, discount: 25, rating: 4.3, reviews: 3402, badge: null, image: 'https://www.netmeds.com/images/product-v1/600x600/15910/biotique_bio_papaya_face_pack_75_g_0_0.jpg', description: 'A fruit-based enzyme pack that exfoliates dead cells to reveal fresh, bright skin.', ingredients: 'Papaya enzyme, Wheat germ, Honey, Aloe Vera', benefits: ['Gentle exfoliation', 'Brightens dull skin', 'Reduces tan', 'Unclogs pores', 'Smooth texture'], usage: 'Apply on face, leave for 15 mins, rinse off with water. Use 2-3 times weekly.' },

  // ── HAIR CARE ──
  { id: 'ay014', name: 'Indulekha Bhrungha Hair Oil 100ml', category: 'hair', price: 295, originalPrice: 349, discount: 15, rating: 4.6, reviews: 5123, badge: 'Bestseller', image: 'https://www.netmeds.com/images/product-v1/600x600/563023/indulekha_bhringa_hair_oil_100ml_0.jpg', description: 'The original Ayurvedic oil enriched with Bhrungharaj and Svetakutaja to address hair fall and promote regrowth.', ingredients: 'Bhrungharaj, Svetakutaja, Amla, Coconut oil, Sesame oil, 18+ precious herbs', benefits: ['Reduces hair fall from roots', 'Promotes new hair growth', 'Prevents scalp infections', 'Nourishes deeply', 'Prevents premature greying'], usage: 'Apply using comb applicator on scalp twice weekly. Leave 30 mins before wash.' },
  { id: 'ay015', name: 'Kesh King Scalp & Hair Oil 300ml', category: 'hair', price: 379, originalPrice: 449, discount: 16, rating: 4.4, reviews: 4320, badge: 'Popular', image: 'https://www.netmeds.com/images/product-v1/600x600/15910/kesh_king_scalp_and_hair_oil_300ml_0_0.jpg', description: 'Scientifically crafted with 21 powerful herbs to strengthen hair from root to tip.', ingredients: 'Bhringraj, Amla, Neem, Yashtimadhu, Ashwagandha, 16 more herbs', benefits: ['21-herb formula for strong hair', 'Reduces dandruff', 'Controls itchy scalp', 'Strengthens hair shaft', 'Ayurvedic scalp nourishment'], usage: 'Warm the oil slightly. Apply generously on scalp and hair. Wash after 1 hour.' },
  { id: 'ay016', name: 'Mamaearth Onion Hair Mask 200ml', category: 'hair', price: 349, originalPrice: 399, discount: 13, rating: 4.5, reviews: 8761, badge: 'Trending', image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop', description: 'Deep conditioning onion hair mask to restore hair strength and shine.', ingredients: 'Onion Seed Oil, Aloe Vera, Hydrolyzed Wheat Protein', benefits: ['Reduces hair breakage', 'Adds intense shine', 'Controls frizz', 'Strengthens damaged hair', 'Toxin-free formula'], usage: 'Apply on washed damp hair, leave 20–30 minutes, rinse thoroughly.' },
  { id: 'ay017', name: 'Patanjali Kesh Kanti Shampoo 200ml', category: 'hair', price: 79, originalPrice: 99, discount: 20, rating: 4.2, reviews: 6543, badge: null, image: 'https://www.netmeds.com/images/product-v1/600x600/413083/patanjali_kesh_kanti_hair_cleanser_shampoo_200_ml_0.jpg', description: 'Herbal shampoo with powerful Ayurvedic herbs to cleanse scalp and strengthen hair roots.', ingredients: 'Bhringraj, Reetha, Amla, Shikakai, Henna', benefits: ['Strengthens hair roots', 'Controls oiliness', 'Reduces dandruff', 'Natural scalp cleanser', 'Paraben-free formula'], usage: 'Apply on wet hair, lather and massage, rinse thoroughly. Use 3x per week.' },

  // ── DIGESTIVE HEALTH ──
  { id: 'ay018', name: 'Himalaya Triphala Tablets 60s', category: 'digestive', price: 159, originalPrice: 199, discount: 20, rating: 4.6, reviews: 2109, badge: null, image: 'https://www.netmeds.com/images/product-v1/600x600/15930/himalaya_triphala_tablet_60_s_0.jpg', description: 'Ancient Ayurvedic tridoshic formula that promotes complete digestive health and detox.', ingredients: 'Amalaki, Bibhitaki, Haritaki – equal proportions', benefits: ['Improves gut health', 'Natural constipation relief', 'Detoxifies colon', 'Anti-oxidant rich', 'Balances all three doshas'], usage: 'Take 1-2 tablets at bedtime with warm water.' },
  { id: 'ay019', name: 'Dabur Hingwastak Churna 60g', category: 'digestive', price: 99, originalPrice: 120, discount: 18, rating: 4.3, reviews: 1342, badge: null, image: 'https://www.netmeds.com/images/product-v1/600x600/15910/dabur_hingwastak_churna_60_g_0_0.jpg', description: 'Classical Ayurvedic formulation combining 8 digestive herbs to relieve bloating and gas.', ingredients: 'Hing (Asafoetida), Ginger, Black pepper, Long pepper, Celery seeds, Rock salt, 3 more', benefits: ['Relieves gas and bloating', 'Improves digestion instantly', 'Reduces stomach cramps', 'Stimulates digestive enzymes', 'Carminative and antispasmodic'], usage: '250mg to 500mg with warm water after meals twice daily.' },
  { id: 'ay020', name: 'Kapiva Aloevera + Wheatgrass Juice 1L', category: 'digestive', price: 259, originalPrice: 349, discount: 26, rating: 4.5, reviews: 1876, badge: 'Popular', image: 'https://www.netmeds.com/images/product-v1/600x600/1085174/kapiva_aloevera_wheatgrass_juice_1_l_0.jpg', description: 'A powerful combination of Aloe Vera pulp and Wheatgrass for complete gut and metabolic health.', ingredients: 'Aloe Vera inner leaf gel (60%), Wheatgrass juice (40%)', benefits: ['Heals inflamed gut lining', 'Alkalizes the body', 'Boosts metabolism', 'Detoxifies liver', 'Reduces acid reflux'], usage: '30ml every morning on empty stomach with water for best results.' },
  { id: 'ay021', name: 'AVP Digestive Churna 100g', category: 'digestive', price: 129, originalPrice: 170, discount: 24, rating: 4.4, reviews: 876, badge: null, image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=400&fit=crop', description: 'Kerala\'s premium classical Ayurvedic churna for complete digestive wellness.', ingredients: 'Haritaki, Pippali, Kutaj, Chitrak, Ginger, Shatapushpa', benefits: ['Regulates irregular bowel', 'Reduces IBS symptoms', 'Enhances appetite', 'Detoxifies digestive tract', 'Kerala Ayurveda certified'], usage: '5g with warm water or ghee after meals twice daily.' },

  // ── WELLNESS / GENERAL ──
  { id: 'ay022', name: 'Himalaya Liv.52 DS 120 Tablets', category: 'wellness', price: 399, originalPrice: 499, discount: 20, rating: 4.8, reviews: 9321, badge: 'Bestseller', image: 'https://www.netmeds.com/images/product-v1/600x600/15911/himalaya_liv_52_ds_tablet_120_s_0.jpg', description: 'The world\'s bestselling liver support formula with Capers and Chicory herbs.', ingredients: 'Himsra (Capparis spinosa), Kasani (Cichorium intybus), Mandur bhasma', benefits: ['Liver protection & regeneration', 'Restores appetite', 'Prevents fatty liver', 'Detoxifies liver naturally', 'Protects from hepatotoxins'], usage: '2 tablets twice daily with water after meals for best results.' },
  { id: 'ay023', name: 'Organic India Triphala Capsules 60s', category: 'wellness', price: 299, originalPrice: 360, discount: 17, rating: 4.6, reviews: 1543, badge: 'Organic', image: 'https://www.netmeds.com/images/product-v1/600x600/1010298/organic_india_triphala_capsule_60_s_0.jpg', description: 'Certified organic Triphala capsules sourced from tri-dosha balancing regions of India.', ingredients: 'Organic Amla, Organic Haritaki, Organic Bibhitaki – equal ratio, Vegetable cellulose caps', benefits: ['USDA organic certified', 'Complete body detox', 'Promotes regularity', 'Eye and skin health', 'Balances all doshas'], usage: '1-2 capsules with warm water at bedtime.' },
  { id: 'ay024', name: 'Zandu Pancharishta Digestive Tonic 450ml', category: 'wellness', price: 199, originalPrice: 250, discount: 20, rating: 4.4, reviews: 4231, badge: null, image: 'https://www.netmeds.com/images/product-v1/600x600/15920/zandu_pancharishta_digestive_tonic_450_ml_0.jpg', description: 'A classical Ayurvedic liquid tonic with 36 natural herbs for overall digestive and health wellness.', ingredients: 'Draksha, Chitrakmool, Ajmoda, Sounth, 32 more herbs', benefits: ['Improves overall digestion', 'Reduces flatulence', 'Enhances appetite', 'Provides natural energy', 'Supports liver health'], usage: '15-30ml twice daily after meals with equal water.' },
  { id: 'ay025', name: 'Kapiva Himalayan Shilajit Resin 20g', category: 'wellness', price: 999, originalPrice: 1299, discount: 23, rating: 4.7, reviews: 2876, badge: 'Premium', image: 'https://www.netmeds.com/images/product-v1/600x600/1085171/kapiva_himalayan_shilajit_resin_20_g_0.jpg', description: 'Pure Himalayan Shilajit harvested from 18,000+ ft altitude, fulvic acid 67%, processed via cold temperature.', ingredients: 'Pure shilajit resin, Fulvic acid min 67%, Humic acid', benefits: ['Natural testosterone booster', 'Reduces physical fatigue', 'Enhances strength & power', 'Improves male vitality', 'Deep Himalayan minerals'], usage: 'Rice grain size dissolved in warm milk or water once daily.' },
  { id: 'ay026', name: 'Banyan Botanicals Gymnema Tablets 90s', category: 'wellness', price: 649, originalPrice: 799, discount: 19, rating: 4.5, reviews: 876, badge: null, image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=400&fit=crop', description: 'Gymnema sylvestre, the "sugar destroyer" herb for healthy blood sugar management.', ingredients: 'Gymnema sylvestre leaf extract 400mg, Gymnema leaf powder 100mg', benefits: ['Natural blood sugar control', 'Reduces sugar cravings', 'Supports weight management', 'Non-habit forming', 'USDA certified organic'], usage: '1 tablet twice daily with meals.' },

  // ── TRENDING SPECIALS ──
  { id: 'ay027', name: 'Dr. Vaidya Herbo24 for Immunity Kit', category: 'immunity', price: 799, originalPrice: 999, discount: 20, rating: 4.7, reviews: 1342, badge: 'Trending', image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=400&fit=crop', description: 'A powerful herbal immunity combo recommended by 50,000+ Ayurvedic doctors across India.', ingredients: 'Ashwagandha, Tulsi, Shatavari, Giloy, Amalaki blend', benefits: ['Doctor-recommended formula', 'Clinical-grade herb extracts', 'Builds long-term immunity', 'Reduces recovery time', 'Zero chemicals or steroids'], usage: '2 tablets twice daily with warm water for minimum 60 days.' },
  { id: 'ay028', name: 'Saffola Arogyam Immunity Kit', category: 'immunity', price: 499, originalPrice: 699, discount: 29, rating: 4.6, reviews: 987, badge: 'Trending', image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop', description: 'Complete immunity pack with Chyawanprash, Giloy drops, and Tulsi green tea — from Saffola.', ingredients: 'Giloy extract, Chyawanprash blend, Tulsi leaf infusion', benefits: ['Comprehensive immunity kit', 'Multiple Ayurvedic formats', '30-day complete protocol', 'Tested & certified safe', 'Supports year-round wellness'], usage: 'Follow the 3-product daily wellness protocol included in kit.' },
  { id: 'ay029', name: 'Veda5 Pure Sandalwood Face Cream 50g', category: 'skin', price: 1299, originalPrice: 1599, discount: 19, rating: 4.8, reviews: 621, badge: 'Luxury', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop', description: 'Premium Ayurvedic face cream with pure Mysore sandalwood, rose water and saffron extract.', ingredients: 'Sandalwood oil (Mysore), Saffron extract, Rose hydrosol, Shea butter', benefits: ['Reduces dark spots & blemishes', 'Saffron brightening action', 'Sandalwood cooling effect', 'Luxury skin feel', 'Premium Ayurvedic formulation'], usage: 'Apply small amount morning and night on cleansed face and neck.' },
  { id: 'ay030', name: 'Kayos Botanicals Bhringraj Mask 100g', category: 'hair', price: 399, originalPrice: 499, discount: 20, rating: 4.6, reviews: 763, badge: 'Trending', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=400&fit=crop', description: 'Potent hair mask infused with pure Bhringraj and Hibiscus to revive and rejuvenate hair.', ingredients: 'Bhringraj powder, Hibiscus leaf powder, Amla, Shikakai, Coconut milk', benefits: ['Revives dull & lifeless hair', 'Reduces hair fall significantly', 'Adds natural shine', 'Scalp treatment & nourishment', 'Free of SLS, SLES, Paraben'], usage: 'Mix with water to form paste, apply on scalp and hair, rinse after 30-45 minutes.' },
];

const AYURVEDA_FILE = path.join(__dirname, 'ayurveda_data.json');

import { AyurvedaProduct } from './models/AyurvedaProduct.js';

// Seed MongoDB with Ayurveda products if empty
async function seedAyurvedaMongo() {
    try {
        const count = await AyurvedaProduct.countDocuments();
        if (count === 0 && isMongo) {
            await AyurvedaProduct.insertMany(AYURVEDA_PRODUCTS);
            console.log('🌿 Ayurveda products seeded to MongoDB');
        }
    } catch (e) {
        console.error('Failed to seed Ayurveda products:', e);
    }
}

// Attach seeding to mongoose connect
mongoose.connection.once('open', () => {
    seedAyurvedaMongo();
});

app.get('/api/ayurveda-products', async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice, minRating, sort } = req.query;

        if (!isMongo) {
            // Local JSON Fallback Logic
            let products = [...AYURVEDA_PRODUCTS];
            if (category && category !== 'all') products = products.filter(p => p.category === category);
            if (search) {
                const q = search.toLowerCase();
                products = products.filter(p => 
                    p.name.toLowerCase().includes(q) || 
                    p.category.toLowerCase().includes(q) || 
                    (p.description || '').toLowerCase().includes(q)
                );
            }
            if (minPrice) products = products.filter(p => p.price >= Number(minPrice));
            if (maxPrice) products = products.filter(p => p.price <= Number(maxPrice));
            if (minRating) products = products.filter(p => p.rating >= Number(minRating));

            if (sort === 'price-low') products.sort((a, b) => a.price - b.price);
            else if (sort === 'price-high') products.sort((a, b) => b.price - a.price);
            else if (sort === 'rating') products.sort((a, b) => b.rating - a.rating);
            else if (sort === 'discount') products.sort((a, b) => b.discount - a.discount);
            else if (sort === 'popular') products.sort((a, b) => b.reviews - a.reviews);

            return res.json(products);
        }

        let query = {};
        if (category && category !== 'all') {
            query.category = category;
        }
        if (search) {
            const q = search.toLowerCase();
            query.$or = [
                { name: { $regex: q, $options: 'i' } },
                { category: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ];
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (minRating) {
            query.rating = { $gte: Number(minRating) };
        }

        let mongoQuery = AyurvedaProduct.find(query);

        if (sort === 'price-low') mongoQuery = mongoQuery.sort({ price: 1 });
        else if (sort === 'price-high') mongoQuery = mongoQuery.sort({ price: -1 });
        else if (sort === 'rating') mongoQuery = mongoQuery.sort({ rating: -1 });
        else if (sort === 'discount') mongoQuery = mongoQuery.sort({ discount: -1 });
        else if (sort === 'popular') mongoQuery = mongoQuery.sort({ reviews: -1 });

        const products = await mongoQuery.exec();
        res.json(products);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/ayurveda-products/:id', async (req, res) => {
    try {
        if (!isMongo) {
            const product = AYURVEDA_PRODUCTS.find(p => p.id === req.params.id);
            if (!product) return res.status(404).json({ error: 'Product not found' });
            return res.json(product);
        }
        const product = await AyurvedaProduct.findOne({ id: req.params.id });
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(PORT, () => console.log(`🚀 Apollo Storefront Ready on Port ${PORT}`));
