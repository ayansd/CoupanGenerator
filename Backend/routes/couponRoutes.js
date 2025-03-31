import express from 'express';
import { db } from '../db.js';
import rateLimit from 'express-rate-limit';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from "mongodb";   //  Make sure to import this
import bcrypt from "bcryptjs";


const router = express.Router();
const claimLimiter = rateLimit({ windowMs: 60 * 1000, max: 3, message: 'Too many requests, please try again later.' });

router.post('/claim', claimLimiter, async (req, res) => {
    try {
        console.log(" New Claim Request Received:");
        console.log("IP:", req.ip);
        console.log("User-Agent:", req.headers['user-agent']);

        //  Step 1: Check if a claim already exists
        const existingClaim = await db.collection("claims").findOne({
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });

        if (existingClaim) {
            console.log(" Claim already exists for this user.");
            return res.status(429).json({ message: 'You have already claimed a coupon!' });
        }

        //  Step 2: Find an available coupon
        const availableCoupon = await db.collection("coupons").findOne({ claimed: false });

        if (!availableCoupon) {
            console.log(" No available coupons.");
            return res.status(400).json({ message: 'No coupons available' });
        }

        console.log(" Found Available Coupon:", availableCoupon);

        //  Step 3: Convert `_id` to ObjectId only if necessary
        let couponId = availableCoupon._id;
        if (typeof couponId === 'string') {
            couponId = new ObjectId(couponId); // Ensure it's an ObjectId
        }

        //  Step 4: Attempt to update the coupon
        const updateResult = await db.collection("coupons").updateOne(
            { _id: couponId, claimed: false },  // Make sure `claimed: false` is checked
            { $set: { claimed: true } }
        );

        if (updateResult.modifiedCount === 0) {
            console.log(" Failed to update coupon as claimed.");
            return res.status(500).json({ message: 'Failed to claim coupon' });
        }

        console.log(" Coupon successfully updated to claimed!");

        //  Step 5: Save claim record
        await db.collection("claims").insertOne({
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            coupon: availableCoupon.code,
            timestamp: new Date()
        });

        res.json({ message: 'Coupon claimed successfully!', coupon: availableCoupon.code });

    } catch (err) {
        console.error(" Backend Error:", err);
        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message 
        });
    }
});
//-------------------------------------------ADDING COUPAN MANUALLY IN STARTING------------------------------------------------------------------ // 

router.post('/add-coupons', async (req, res) => {
    try {
        const coupons = [];
        for (let i = 1; i <= 100; i++) {
            coupons.push({
                code: `COUPON-${uuidv4()}`,
                claimed: false,
                createdAt: new Date(),
            });
        }

        await db.collection("coupons").insertMany(coupons); // ✅ Use imported db directly
        res.json({ message: '100 coupons added successfully!' });
    } catch (err) {
        console.error("Backend Error:", err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.post("/findUser", async (req, res) => {
    try {
        const { Email, PhoneNumber, Password} = req.body;

        if (!Email || !PhoneNumber || !Password) {
            return res.status(400).json({ error: "Email , Phone Number and Password are required!" });
        }

        
        const existingUser = await db.collection("user").findOne({
            $or: [{ Email }, { PhoneNumber }]
        });

        if (existingUser) {
            return res.json({ exists: true, message: "User already registered. Please login." });
        }

        // If not found, insert user



        const salt = await bcrypt.genSalt(10); // Generate a salt
        const hashedPassword = await bcrypt.hash(Password, salt);


        const newUser = {
            _id: uuidv4(),  // Unique user ID
            Email,
            PhoneNumber,
            Password: hashedPassword,
            CreatedAt: new Date()
        };

        await db.collection("user").insertOne(newUser);

        res.json({ exists: false, message: "You have successfully signed up!" });

    } catch (error) {
        console.error("Error in /findUser:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ error: "Email and Password are required!" });
        }
        const user = await db.collection("user").findOne({ Email: email});

        if (!user) {
            return res.status(404).json({ message: "User not found. Please register." });
          }

          const isMatch = await bcrypt.compare(password, user.Password);

          if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        res.status(200).json({ message: "Successfully Logged In!" });

      
    }

    catch(error){
        res.status(500).json({ message: "Internal Server Error" });
    }
});


//----------------------------------------------ADMIN PAGE FUNCTION----------------------------------------------------------------------------------- //


router.get("/all", async (req, res) => {
    try {
      const coupons = await db.collection("coupons").find({}).toArray();
      res.json(coupons);
    } catch (err) {
      console.error("Error fetching coupons:", err);
      res.status(500).json({ error: "Failed to fetch coupons" });
    }
  });

  router.post("/add", async (req, res) => {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: "Coupon code is required" });
  
    try {
      const newCoupon = {
        _id: uuidv4(), // Generate unique ID
        code,
        createdAt: new Date(),
        claimed: false,
      };
  
      await db.collection("coupons").insertOne(newCoupon);
      res.status(201).json({ message: "Coupon added successfully", newCoupon });
    } catch (err) {
      console.error("Error adding coupon:", err);
      res.status(500).json({ error: "Failed to add coupon" });
    }
  });

  // Delete a coupon
  router.put("/claim/:id", async (req, res) => {
    const { id } = req.params;
    const { claimed } = req.body;

 

    try {
        const objectId = new ObjectId(id);
     

        const updatedCoupon = await db.collection("coupons").findOneAndUpdate(
            { _id: objectId },
            { $set: { claimed: claimed } },
            { returnDocument: "after" }
        );

        if (!updatedCoupon) {
            
            return res.status(404).json({ error: "Coupon not found" });
        }

        
        res.json({ message: "Coupon status updated", updatedCoupon: updatedCoupon.value });

    } catch (err) {
       
        res.status(500).json({ error: "Failed to update coupon" });
    }
});

export default router;