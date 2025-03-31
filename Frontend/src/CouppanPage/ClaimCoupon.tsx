import {useState} from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './ClaimCoupon.css';
import loginBackground2 from  '../../assets/loginBackground2.jpg'
import { CircularProgress} from '@mui/material/';
function ClaimCoupon() {

    const navigate = useNavigate();

    const [message, setMessage] = useState<string>('');
    const [coupon, setCoupon] = useState<string | null>(
        localStorage.getItem('userCoupon'))
    const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
    const [adminData, setAdminData] = useState({ email: '',password: ''});
    const [apiLoading, setApiLoading] = useState(false);
    const [apiLoading1, setApiLoading1] = useState(false);

    const claimCoupon = async () => { 
        setApiLoading(true);
        try {
            const response = await axios.post('https://coupan.onrender.com/coupon/claim');
            setApiLoading(false);
            localStorage.setItem('userCoupon', response.data.coupon);
            setCoupon(response.data.coupon);
            setMessage(response.data.message)
        } catch (error: unknown) {
            console.error("Frontend Error:", error); // Log full error in the browser console
            if (axios.isAxiosError(error)) {
                setMessage(error.response?.data?.message || 'Error claiming coupon');
                setApiLoading(false);
            } else {
                setMessage('An unknown error occurred');
                setApiLoading(false);
            }
        }
    };
    async function AdminPanel() {
        setApiLoading1(true);
        console.log("Admin Login Clicked", adminData);
    
        try {
            
    
             await axios.post("https://coupan.onrender.com/auth/login", adminData, {
                withCredentials: true,  // Ensures cookies are sent
                headers: { "Content-Type": "application/json" },
            });
    setApiLoading1(false);
            alert("Login Successful!");
            navigate("/admin");// Redirect admin
        } catch (err) {
            setApiLoading1(false);
            alert(err instanceof Error ? err.message : "Something went wrong!");
        }
    }
  return (
    <div className="claim-container">
<img src={loginBackground2} alt='Background' className='BackgroundImage'/>
    { apiLoading? (<CircularProgress/>) : (<button onClick={claimCoupon} className='butt'>Claim Coupon</button>)}
    {message && <p className='para'>{message}</p>}

    {coupon && <h3 className='para'>Your Coupon: {coupon}</h3>}

    <button className='Admin' onClick={() => setShowAdminModal(true)}>Admin Login</button>

    {/* Admin Modal */}
    {showAdminModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h2>Admin Login</h2>
                        <input  className='field'
                            type="email" 
                            placeholder="Email" 
                            value={adminData.email} 
                            onChange={(e) => setAdminData({...adminData, email: e.target.value})} 
                        />
                    
                        <input className='field'
                            type="password" 
                            placeholder="Password" 
                            value={adminData.password} 
                            onChange={(e) => setAdminData({...adminData, password: e.target.value})} 
                        />
                       { apiLoading1 ? (<CircularProgress/>):(<button onClick={AdminPanel}>Login</button>)}
                    </div>
                </div>
            )}
        
</div>

  )
}

export default ClaimCoupon