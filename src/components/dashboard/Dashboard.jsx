import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/Auth";
import KaikaiList from "../kaikai-list/KaikaiList";


const Dashboard = () => {

  const {logout} = useAuth()
  const navigate = useNavigate()

  const handleLogout = ()=>{
    logout()
    navigate('/')
  }

  return ( <div>
    Dashboard
    <KaikaiList/>
    
    <button
    onClick = {handleLogout}
    type="button">
      Logout
    </button>
    
  </div> );
}
 
export default Dashboard;