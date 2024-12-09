import axios from "axios";
import { useState } from "react";
import {apiURL2} from '../../constants/constants'


const AddChannel = ({kaikaiList}) => {

  const [channelName, setChannelName] = useState(null);
  const [members, setMembers] = useState([])
  const [memberId, setMemberAdding] = useState(null)
  const [error, setError] = useState(null)
  const [pending, setPending] = useState(false)
  
  

  const handleSubmit = async(e)=>{
    e.preventDefault()
    setPending(true)
    
    if(!members || !channelName){
      return setError('member or channel name is needed')
    }

    const token = JSON.parse(localStorage.getItem('token'))

    const obj = {
      channelName, members
    }
    try{
      const response = await axios.post(`${apiURL2}/api/v1/create-channel`, obj, {headers: {"Authorization": `Bearer ${token}`}})
      setPending(false)
      setError(null)
      console.log(response.data)
      
    
    }
    catch(error){
      setPending(false)
      setError(error.response.data.error)
      console.log(error)
    }
  }

  const handleMemberArray = e =>{
    e.preventDefault()
    if(memberId == null){
      return setError("need to select from current friends")
    }
    const newObj = {
      memberId
    }
    setMembers(prev=>[...prev, newObj])
    setError(null)
  }

  return ( <div>
    <form onSubmit = {handleSubmit}>
      <input
      onChange = {e=>setChannelName(e.target.value)}
      type = "text"
      required></input>
      <button
      type="submit">
        Add Channel
      </button>
    </form>
    <form onSubmit = {handleMemberArray}>
      <select onChange={e=>setMemberAdding(e.target.value)}>
        <option default value="null">Select from friends</option>
        {kaikaiList && kaikaiList.map(friend=>(
          <option key={friend.friendId._id} value={friend.friendId._id}>{friend.friendId.email}</option>
        ))}
      </select>
      <button 
      type="submit">
        Add Member
      </button>
    </form>
    {members && members.join(',')}
    {pending && <div>creating channel...</div>}
    {error && <div>{error}</div>}
    
  </div> );
}
 
export default AddChannel;