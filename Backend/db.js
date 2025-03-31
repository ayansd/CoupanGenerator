import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const client = new MongoClient(MONGO_URI);
let db;

(async () => {
    await client.connect();
    db = client.db("couponDB");
    console.log("MongoDB Connected");
})();

export { db };