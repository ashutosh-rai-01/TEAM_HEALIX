import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: { type: String, default: 'GUEST_USER' },
    items: [
        {
            medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
            name: String,
            quantity: Number,
            price: Number
        }
    ],
    totalAmount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    patientType: { type: String, enum: ['normal', 'regular', 'prebooked'], default: 'normal' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);
