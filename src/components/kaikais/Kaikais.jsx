import { useEffect, useRef, useState } from "react";
import { apiURL, apiURL2 } from "../../constants/constants";
import axios from "axios";

const Kaikais = ({selectedFriend, setMessageRefresh, selectedChannel}) => {
  const [message, setMessage] = useState(null);
  const inputRef = useRef(null)
  
  const handleSubmit = async(e) =>{
    e.preventDefault();
    if(!selectedFriend || !selectedChannel){
      return console.log('no one is selected')
    }
    

  
    
    const token = JSON.parse(localStorage.getItem('token'))
    const messagebody = {
      receiver: selectedFriend ? selectedFriend : selectedChannel,
      receiver_class: selectedFriend? null : "channel",
      body:message
    }
    try{
      const response = await axios.post(`${apiURL2}/api/v1/messages`, messagebody, {headers: {"Authorization": `Bearer ${token}`}})
      console.log(response.data._id)
      setMessageRefresh(prev=>!prev)
    }
    catch(error){
      console.log(error)
    }
    
    inputRef.current.value="";
  }


  return ( <div>
     <form onSubmit={handleSubmit}>

      <input 
        onChange ={ e => setMessage(e.target.value)}
        placeholder="kaikai"
        type="text"
        required
        ref={inputRef}></input>

        <button
          type="submit">
          Send
        </button>
      </form>
      
</div>)
}
 
export default Kaikais;