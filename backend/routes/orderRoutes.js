import express from 'express';
import Order from '../models/Order.js';
import Medicine from '../models/Medicine.js';

const router = express.Router();

// POST place a new order
router.post('/', async (req, res) => {
    try {
        const { items, patientType } = req.body;
        
        let totalAmount = 0;
        items.forEach(item => {
            totalAmount += item.price * item.quantity;
        });

        // Discount Logic
        let discountRate = 0;
        if (patientType === 'regular') discountRate = 0.10;
        else if (patientType === 'prebooked') discountRate = 0.15;

        const discount = totalAmount * discountRate;
        const finalAmount = totalAmount - discount;

        const order = new Order({
            items,
            totalAmount,
            discount,
            finalAmount,
            patientType
        });

        const savedOrder = await order.save();

        // Update Stock
        for (const item of items) {
            await Medicine.findByIdAndUpdate(item.medicineId, {
                $inc: { stock: -item.quantity }
            });
        }

        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
