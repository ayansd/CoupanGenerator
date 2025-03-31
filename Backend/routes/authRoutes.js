import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { db } from '../db.js';

dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';


router.post('/login', async (req, res) => {
    try {
       

        const { email, password } = req.body;
        if (!email || !password) {
           
            return res.status(400).json({ message: "Email and password required" });
        }

        const admin = await db.collection("admins").findOne({ email });
        if (!admin) {
           
            return res.status(401).json({ message: "Invalid credentials" });
        }


        const isMatch = bcrypt.compareSync(password, admin.password);
        if (!isMatch) {
        
            return res.status(401).json({ message: "Invalid credentials" });
        }

        

        const token = jwt.sign({ id: admin._id, username: admin.email }, JWT_SECRET, { expiresIn: '1h' });

        res.cookie('adminToken', token, { httpOnly: true }).json({ message: "Login successful" });

        
    } catch (error) {
    
        res.status(500).json({ message: "Server error", error });
    }
});


router.post('/login', async (req, res) => {
    console.log("🔹 Login request received:", req.body);
    const { email, password } = req.body;
    const admin = await db.collection("admins").findOne({ email });

    if (!admin || !bcrypt.compareSync(password, admin.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id, username: admin.email }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('adminToken', token, { httpOnly: true }).json({ message: 'Login successful' });
});

router.get('/coupons', async (req, res) => {
    const coupons = await db.collection("coupons").find().toArray();
    res.json(coupons);
});

export default router;