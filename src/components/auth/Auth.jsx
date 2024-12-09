import axios from "axios";
import { createContext, useState, useContext, useEffect } from "react";
import { apiURL, apiURL2 } from "../../constants/constants";
import { useNavigate } from "react-router-dom";

const loginContext= createContext();


const AuthProvider = ({children}) => {

  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('login'));
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null)
  const [uid, setUid] = useState(JSON.parse(localStorage.getItem('uid')))

  const login = async (email, password)=>{

    setIsPending(true)

    const obj = {
      email, password
    }
    try{
      const response = await axios.post(`${apiURL2}/api/v1/auth/sign_in`, obj)
      setIsLoggedIn(true);
      localStorage.setItem('token', JSON.stringify(response.data.token))
      localStorage.setItem('login', true)
      localStorage.setItem('uid', JSON.stringify(response.data.uid))
      setUid(response.data.uid)
      setIsPending(false)
      setError(null)
      navigate('/')
      
    }
    catch(error){
      console.log(error)
      setIsLoggedIn(false)
      if(error.response || error.response.data){
        setError(error.response.data.error)
      }
      else{
        setError('an unexpected error occurred')
      }
      setTimeout(()=>{
        setError(null)
      },3000)
      setIsPending(false)
      navigate('/')
    }
    
  }

  const logout = ()=>{
    setIsLoggedIn(false);
    localStorage.clear("token");
    localStorage.clear("login")
    navigate('/')
  }




  return ( <loginContext.Provider value={{isLoggedIn, login, logout, isPending, error, uid}}>
    {children}
  </loginContext.Provider> );
}

const useAuth = ()=>useContext(loginContext);
 
export {useAuth, AuthProvider} ;