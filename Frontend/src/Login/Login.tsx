import  {useState} from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import './Loginstyle.css';
import { CircularProgress} from '@mui/material/';
import axios from 'axios';
import LoginBackground1 from '../../assets/loginBackground1.jpg'



const schema = yup.object().shape({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string()
        .min(8, 'Password must be at least 8 characters')
        .max(25, 'Password cannot exceed 25 characters')
        .matches(/[A-Z]/, 'Must include at least one uppercase letter')
        .matches(/[a-z]/, 'Must include at least one lowercase letter')
        .matches(/\d/, 'Must include at least one number')
        .matches(/[!@#$%^&*]/, 'Must include at least one special character (!,@,#,$,%,^,&,*)')
        .required('Password is required'),
});
function Login() {
    const navigate = useNavigate();
    const [apiLoading, setApiLoading] = useState(false);

    const { register, handleSubmit, formState: { errors },reset } = useForm({
        resolver: yupResolver(schema),
        defaultValues : {
            email:"",
            password:"",
        }
    });

   async function onSubmit(data: {email: string;password: string}){
        console.log('Login Data:', data);
        setApiLoading(true)
        try {
             await axios.post("https://coupan.onrender.com/coupon/login", {
              email: data.email, // Replace with user input
              password: data.password, 
            });
        
            alert("Successfully Logged In!");
            setApiLoading(false);
            reset ({
                email:'',
                password:''
            })
            navigate('/main');


          } catch (error) {
            console.error("Login Error:", error);
        
            if (axios.isAxiosError(error)) {
              alert(error.response?.data?.message || "You have not registered. Sign in or continue with Guest Login.");
              setApiLoading(false);
              reset ({
                email:'',
                password:''
            })
            } else {
              alert("Something went wrong. Please try again later.");
              setApiLoading(false);
              reset ({
                email:'',
                password:''
            })
            }
          } 

    };

        function handleGuestLogin() {
          navigate("/main"); 
        };
    
      
  return (

    <div className='WholeContainer'>
       
        <img src= {LoginBackground1} alt='LoginBackground' className='BackgroundImage' />
    <div className="login-container">
    <h2 className='heading'>Login</h2>
    <form onSubmit={handleSubmit(onSubmit)}>
      
        <input type="email"  placeholder='Email'{...register('email')} />
        <p className="error">{errors.email?.message}</p>

       
        <input type="password" placeholder='Password'{...register('password')} />
        <p className="error">{errors.password?.message}</p>

    {apiLoading ? (<CircularProgress/>):(<button type="submit" className="login-button">Login</button>) }

        <div className="login-options">
            <button type="button" className="forgot-password" onClick={handleGuestLogin}>Guest Login</button>
            <Link to="/signup" className="signup-link">Sign Up</Link>
        </div>
       
    </form>
    </div>
</div>
  )
}

export default Login