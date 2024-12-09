import { Link } from "react-router-dom";
import { useAuth } from "../auth/Auth";
import { useState } from "react";


const Login = () => {

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const {login,isPending, error} = useAuth();
 

  const handleSubmit = e =>{
    e.preventDefault();
    login(email,password)
   
    
  }

  return ( <div>
     <form onSubmit={handleSubmit}>

<input 
  onChange ={ e => setEmail(e.target.value)}
  placeholder="email"
  type="text"></input>

<input 
  onChange = {e=> setPassword(e.target.value)}
  type="password"
  placeholder="password"></input>



  <button
    type="submit">
    Login
  </button>
</form>

{isPending && <div>Logging in...</div>}
{error && <div>{error}</div>}
<Link to = "/sign-up">Sign-up</Link>

  </div> );
}
 
export default Login;