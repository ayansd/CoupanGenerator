import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import { verifyAdmin } from './middlewares/authMiddleware.js';
import './db.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
    origin: ["http://localhost:5173", "https://coupan.netlify.app" ],// Change this to match your frontend port
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());


app.use('/auth', authRoutes);
app.use('/coupon', couponRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));