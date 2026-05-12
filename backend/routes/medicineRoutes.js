import express from 'express';
import Medicine from '../models/Medicine.js';

const router = express.Router();

// GET all medicines
router.get('/', async (req, res) => {
    try {
        const medicines = await Medicine.find();
        res.json(medicines);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new medicine (Admin use)
router.post('/', async (req, res) => {
    const medicine = new Medicine({
        name: req.body.name,
        price: req.body.price,
        stock: req.body.stock,
        category: req.body.category,
        expiryDate: req.body.expiryDate
    });

    try {
        const newMedicine = await medicine.save();
        res.status(201).json(newMedicine);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
