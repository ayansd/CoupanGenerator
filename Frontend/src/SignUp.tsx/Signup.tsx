import {useState} from 'react';
import { Link , useNavigate} from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import './SignUp.css';
import axios from 'axios';
import { CircularProgress} from '@mui/material/';
import Background from '../../assets/Background.jpg'



const schema = yup.object().shape({
    FullName: yup
    .string()
    .matches(/^[a-zA-Z\s]{3,25}$/, 'Enter a valid name (3-25 characters, letters and spaces)')
    .required('Full Name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    phone: yup.string()
        .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
        .required('Phone number is required'),
    password: yup.string()
        .min(8, 'Password must be at least 8 characters')
        .max(25, 'Password cannot exceed 25 characters')
        .matches(/[A-Z]/, 'Must include at least one uppercase letter')
        .matches(/[a-z]/, 'Must include at least one lowercase letter')
        .matches(/\d/, 'Must include at least one number')
        .matches(/[!@#$%^&*]/, 'Must include at least one special character (!,@,#,$,%,^,&,*)')
        .required('Password is required'),
});
function Signup() {
const navigate = useNavigate();
    const [apiLoading, setApiLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            FullName: "",
            email: "",
            phone: "",
            password: "",
        },
        mode: "onSubmit",  // Ensures validation runs on submit
    });
    async function onSubmit (data: { FullName:string; email: string; phone: string; password: string }) {
        console.log("Received Data:", data);
        try {
            // Extract and validate inputs 
            const mailCheck = data.email ? data.email.toString() : "";
            const phoneCheck = data.phone ? data.phone.toString() : "";
        const password= data.password ? data.password.toString(): "";
            if (!mailCheck || !phoneCheck) {
              alert("Please provide both Email and Phone Number.");
              return;
            }
       
            // Set loading state to true
            setApiLoading(true);
        
            // Make API request
            axios.post("https://coupan.onrender.com/coupon/findUser", {
              Email: mailCheck,
              PhoneNumber: phoneCheck,
              Password : password
            })
              .then((response) => {
                 // Debugging response
                if (response.data.exists) {
                  alert("You are already registered. Please proceed to login...");
                  setApiLoading(false);
                  reset({
                    FullName: "", 
                    email: "",
                    phone: "",
                    password: "",
                  });
                } else {
                  setApiLoading(false);
               alert("You have Successfully signed up...")
               reset({
                FullName: "", 
                email: "",
                phone: "",
                password: "",
              });
navigate('/');
                }
                 // Reset loading state
              })
              .catch((error) => {
                console.error("Error Calling the API:", error); // Debugging error
                alert("An error occurred while checking your details. Please try again later.");
                setApiLoading(false);
              });
          } catch (error) {
            console.error("Unexpected Error:", error); 
            setApiLoading(false); // Reset loading state in case of unexpected errors
          }
    };

  return (
    <div className='wholeContainer'>
    <img src= {Background} alt= 'Background' className='BackgroundImage'/>
    
   
    <div className="signup-container">
    <h3 className=' heading'>Sign Up</h3>
         <form onSubmit={handleSubmit(onSubmit)}>
           
         <input type="text" placeholder="Full Name" {...register("FullName")} />
         <p className="error">{errors.FullName?.message}</p>
     
         

                <input type="email" placeholder='Email' {...register('email')} />
                <p className="error">{errors.email?.message}</p>

                <input type="text" placeholder='Phone Number'{...register('phone')} />
                <p className="error">{errors.phone?.message}</p>

                
                <input type="password" placeholder='Password'{...register('password')} />
                <p className="error">{errors.password?.message}</p>

              { apiLoading ? (<CircularProgress/>): (<button type="submit">Sign Up</button>)}
              <h5 className = 'login' >Alredy have an Account ? <Link to="/" className= 'login1'> log in</Link></h5>
            </form>
</div>
</div>
  
  )
}

export default Signup