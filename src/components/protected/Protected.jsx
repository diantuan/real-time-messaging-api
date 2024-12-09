import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/Auth";


const Protected = () => {
  const {isLoggedIn} = useAuth();
  
  return isLoggedIn ? <Outlet/> : <Navigate to="/login"></Navigate>
}
 
export default Protected;