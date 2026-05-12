import mongoose from 'mongoose';

const ayurvedaProductSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    discount: { type: Number },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    badge: { type: String },
    image: { type: String },
    description: { type: String },
    ingredients: { type: String },
    benefits: [String],
    usage: { type: String }
}, { timestamps: true });

export const AyurvedaProduct = mongoose.models.AyurvedaProduct || mongoose.model('AyurvedaProduct', ayurvedaProductSchema);
