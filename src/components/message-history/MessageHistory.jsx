import axios from "axios";
import { useEffect, useState } from "react";
import { apiURL, apiURL2 } from "../../constants/constants";
import io  from "socket.io-client";
import './messagehistory.css'
import { useAuth } from "../auth/Auth";

const MessageHistory = ({selectedFriend, messageRefresh, selectedChannel}) => {

  const [messages, setMessages] = useState(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(null)
  const {uid} = useAuth()

  useEffect(()=>{

    const socket = io('https://kaikai-api-27e7ca2ff396.herokuapp.com')

    const token = JSON.parse(localStorage.getItem('token'))

    const retrieveMessages = async()=>{

      setPending(true)

      if(!selectedFriend && !selectedChannel){
        setPending(false)
        return setError("select a friend or channel to show kaikai history")
      }
      try{
        const response = await axios.get(`${apiURL2}/api/v1/messages/${selectedFriend ? "user" : "channel"}/${selectedFriend ? selectedFriend : selectedChannel}`, {headers: {"Authorization":`Bearer ${token}`}})
        setMessages(response.data)
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

    
    retrieveMessages();

    socket.on('refresh', ()=>{
      console.log('heard refresh')
      retrieveMessages()
    })

    return ()=>socket.close();
  }

  ,[selectedFriend, selectedChannel, messageRefresh])



  return ( <div className="messages">
    Messages:
    {pending && <div>getting kaikais...</div>}
    {error && <div>{error}</div>}
    {messages && messages.map(message=>(
      <div key={message._id}> 
        <span>{message.sender.email}</span>
        <div className={message.sender._id.toString() === uid  ? "right-align" : "left-align"}
        >{message.body}</div>


      </div>  
    ))}
  </div> );
}
 
export default MessageHistory;