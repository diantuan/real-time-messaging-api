import { useEffect, useState } from "react";
import axios from 'axios'
import AddFriend from "../addfriend/AddFriend";
import { apiURL, apiURL2 } from "../../constants/constants";
import MessageHistory from "../message-history/MessageHistory";
import Kaikais from "../kaikais/Kaikais";
import './KakaiList.css'
import io from "socket.io-client";
import AddChannel from "../channels/AddChannel";
import GetChannel from "../channels/GetChannel";



const KaikaiList = () => {

  const [kaikaiList, setKaikaiList] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null)
  const [refresh, refreshList] = useState(false)
  const [selectedFriend, setSelectedFriend] = useState(null)
  const [messageRefresh, setMessageRefresh] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null)

  useEffect(()=>{

    const socket = io(apiURL2)
    const token = JSON.parse(localStorage.getItem('token'))

    const getFriends = async()=>{

      try{
      
        const response = await axios.get(`${apiURL2}/api/v1/friendlist`, {headers: {"Authorization": `Bearer ${token}`}})
        console.log(response)
  
        setKaikaiList(response.data)
        setIsPending(false)
        setError(null)
        
        
      }
      catch(error){
        setIsPending(false)
        if (error.response && error.response.data) {
          
          setError(error.response.data.error);
        } else {
          
          setError("An unexpected error occurred.");
        }

       }
    }
      getFriends().catch(err=>console.error("caught in getFriends", err));

      socket.on('refreshFriends', ()=>{
        getFriends()
      })

      return ()=>socket.close()
  },[refresh])

  const selectFriend = id=>{
    setSelectedFriend(id)
    setSelectedChannel(null)
  }

  const selectChannel = id =>{
    setSelectedChannel(id)
    setSelectedFriend(null)
    console.log(id)
  }
  return ( <div>
    <AddFriend refreshList={refreshList}/>
    {isPending && <div>Loading...</div>}
    {error && <div>{error}</div>}
    {kaikaiList && kaikaiList.map(friend=>(<div key={friend.friendId._id}
      onClick={()=>{selectFriend(friend.friendId._id)}}
      className = {selectedFriend === friend.friendId._id ? "friendEmail active" : "friendEmail"}>
      <div>{friend.friendId.email}</div>
      </div>))}
     <MessageHistory selectedFriend={selectedFriend} messageRefresh={messageRefresh} selectedChannel={selectedChannel}/>
     <Kaikais setMessageRefresh={setMessageRefresh} selectedFriend={selectedFriend}  selectedChannel={selectedChannel}/>
     <AddChannel kaikaiList = {kaikaiList} />
     <GetChannel selectChannel={selectChannel} kaikaiList={kaikaiList} selectedChannel={selectedChannel}/>
     
  </div> );
}
 
export default KaikaiList;
