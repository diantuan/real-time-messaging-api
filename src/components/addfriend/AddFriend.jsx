import axios from "axios";
import { useState } from "react";
import { apiURL, apiURL2 } from "../../constants/constants";


const AddFriend = ({refreshList}) => {

  const[friendEmail, setFriendEmail] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async(e)=>{

    e.preventDefault();
    setIsPending(true)
    const token = JSON.parse(localStorage.getItem('token'))

    if(!friendEmail){
     return   
    }

    try{

      
      const response = await axios.post(`${apiURL2}/api/v1/addfriend`, {friendEmail}, {headers:{"Authorization": `Bearer ${token}`}})
      refreshList((prev)=>!prev);
      console.log(response.data)
      setIsPending(false);
      setError(null);
    }
    catch(error){
      console.log(error.response)
      setIsPending(false)
      setError(error.response.data.error)
    }
    
  }

return ( <div>
    <form onSubmit={handleSubmit}>

      <input
      onChange ={e=>setFriendEmail(e.target.value)}
      type="email" required></input>

      <button
      type="submit">
        Add Friend
      </button>
      
      {isPending && <div>finding...</div>}
      {error && <div>{error}</div>}

    </form>
  </div> );
}
 
export default AddFriend;