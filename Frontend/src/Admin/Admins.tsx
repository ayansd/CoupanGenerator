import  { useState, useEffect } from "react";
import axios from "axios";
import '../Admin/Admin.css'
import AdminBackground from '../../assets/AdminBackground.jpg'
interface Coupon {
    _id: string | { $oid: string }; // Handles MongoDB ObjectId variations
    code: string;
    createdAt: number | { $date: { $numberLong: string } };
    claimed: boolean;
}



function Admins() {

    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [newCoupon, setNewCoupon] = useState("");

    useEffect(() => {
        fetchCoupons();
    }, []);

    async function fetchCoupons() {
        try {
            const response = await axios.get("https://coupan.onrender.com/coupon/all");
            console.log(" Coupons Data:", response.data);
            setCoupons(response.data);
        } catch (err) {
            console.error("Error fetching coupons:", err);
        }
    }

    async function addCoupon() {
        if (!newCoupon) return alert("Enter a coupon code !");

        try {
            await axios.post("https://coupan.onrender.com/coupon/add", { code: newCoupon });
            setNewCoupon(""); 
            alert("New Coupon was Added Successfully")
            fetchCoupons(); 
        } catch (err) {
            console.error(" Error adding coupon:", err);
        }
    }

    async function deleteCoupon(id: string) {
        if (!window.confirm("Are you sure?")) return;

        try {
            await axios.delete(`https://coupan.onrender.com/coupon/delete/${id}`);
            alert("Coupon was deleted Successfully")
            fetchCoupons();
        } catch (err) {
            console.error(" Error deleting coupon:", err);
        }
    }

    const toggleClaimedStatus = async (couponId: string, currentStatus: boolean) => {
       
    
        try {
           await axios.put(`https://coupan.onrender.com/coupon/claim/${couponId}`, {
                claimed: !currentStatus  // Toggle the claimed status
            });
            alert("Changes Made Succesfully Refresh to see...")
           
            setCoupons((prevCoupons) =>
                prevCoupons.map((coupon) =>
                    coupon._id === couponId ? { ...coupon, claimed: !currentStatus } : coupon
                )
              
            );
        } catch (error: unknown) {  
            if (axios.isAxiosError(error)) {  
               
                
                if (error.response) {  
                    alert("Server Response: " + error.response.data);
                }
            } else {
               alert(" [FRONTEND] Unknown error:")
            }
        }
    };
    
    function formatDate(createdAt: Coupon["createdAt"]): string {
        if (typeof createdAt === "number") {
            return new Date(createdAt).toLocaleString();
        } else if (typeof createdAt === "string") {
            return new Date(createdAt).toLocaleString(); // Convert ISO string to date
        } else if (createdAt?.$date?.$numberLong) {
            return new Date(Number(createdAt.$date.$numberLong)).toLocaleString();
        }
        return "Unknown";
    }

  return (
    <div className="admin-container">
       
        <img src={AdminBackground} alt='Background' className="Background"/>
    
    <h2 className="heading">Admin Panel - Coupons</h2>

    {/* Add Coupon */}
    <div className="add-coupon">
        <input
            type="text"
            placeholder="Enter Coupon Code to add"
            value={newCoupon}
            onChange={(e) => setNewCoupon(e.target.value)}
        />
        <button onClick={addCoupon}>Add Coupon</button>
    </div>

    {/* Display Coupons */}
    <h3 className="Heading">Available Coupons</h3>
    <ul className="coupon-list">
        {coupons.length > 0 ? (
            coupons.map((coupon, index) => {
                if (!coupon) return null;

                const couponId =
                    typeof coupon._id === "string"
                        ? coupon._id
                        : coupon._id?.$oid || `coupon-${index}`;

                return (
                    <li key={couponId} className="list">
                        <b>Code:</b> {coupon.code} | 
                        <b>Created At:</b>  {formatDate(coupon.createdAt)}  |
                        <b>Claimed:</b> {coupon.claimed ? " Yes" : " No"}
                        <button className="delete-button" onClick={() => deleteCoupon(couponId)}>Delete</button>
                        <button className="claim-button" onClick={() => toggleClaimedStatus(couponId, coupon.claimed)}>
                            {coupon.claimed ? "Unclaim" : "Claim"}
                        </button>
                    </li>
                );
            })
        ) : (
            <p>No coupons available.</p>
        )}
    </ul>
</div>
  )
}

export default Admins