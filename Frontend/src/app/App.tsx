import { BrowserRouter as Router, Routes,Route} from 'react-router-dom' ;
import ClaimCoupon from '../CouppanPage/ClaimCoupon'
import Signup from '../SignUp.tsx/Signup';
import Login from '../Login/Login';
import Admins from '../Admin/Admins';
import './App.css'

function App() {
  

  return (
    <Router>
      <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path= '/signup' element={<Signup/>}/>
<Route path='/main' element= {<ClaimCoupon/>}/>
<Route path='/admin'element={<Admins/>}/>
        </Routes>
        </Router>
  )
}

export default App
