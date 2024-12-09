import { useState } from "react";
import axios from "axios";
import { apiURL, apiURL2 } from "../../constants/constants";
import { useNavigate } from "react-router-dom";

const SignUp = () => {

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [password_confirmation, setPasswordConfirmation] = useState(null);
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  const handleSubmit = async (e) =>{
    e.preventDefault();
    setPending(true)
    const obj = {email, password, password_confirmation}
    
    try{
      const response = await axios.post(`${apiURL2}/api/v1/auth`, obj);
      setPending(false)
      setError(null)
      console.log(response)
      navigate('/login')
    }
    catch(error){
      setError(error.response.data.message.split(':')[2])
      setPending(false)
      console.log(error.response)
    }
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

      <input 
        onChange = {e=> setPasswordConfirmation(e.target.value)}
        type="password"
        placeholder="password confirmation"></input>

        <button
          type="submit">
          Sign-up
        </button>
    </form>
    {pending && <div>registering acount...</div>}
    {error && <div>{error}</div>}
  </div> );
}
 
export default SignUp;