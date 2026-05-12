import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    expiryDate: { type: Date, required: true }
});

export default mongoose.model('Medicine', medicineSchema);
