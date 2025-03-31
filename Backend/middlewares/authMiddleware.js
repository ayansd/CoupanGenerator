import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const verifyAdmin = (req, res, next) => {
    const token = req.cookies.adminToken;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid Token' });
        req.admin = decoded;
        next();
    });
};

export { verifyAdmin };