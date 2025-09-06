import "./index.css"
import { useEffect, useRef, useState } from "react";

function App() {

  // const [socket, setSocket] = useState();
  // const inputRef = useRef<HTMLInputElement>();
  // const [data, setData] = useState();
 
  // function sendMessage(){
    
  //   // @ts-ignore
  //   const message = inputRef.current.value;

  //   // @ts-ignore
  //   socket.send(message);
    
  // }

  // useEffect(()=>{
  //   const ws = new WebSocket("ws://localhost:8080");
  //   // @ts-ignore
  //   setSocket(ws);

  //   ws.onmessage = (e)=>{
  //     setData(e.data);
  //   }
  // }, [])

  const [messages,setMessages] = useState([]);
  
  useEffect(()=>{
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (data) => {
      ws.onmessage = () => {
        setMessages(m => [...m,evet.data] )
      }

    }
  },[])

  return (
    <>
      <div className="h-screen w-full flex items-center justify-center gap-4 bg-zinc-950">
        <div className="h-[35rem] w-[50rem] flex flex-col items-center justify-between gap-4 p-4 text-white bg-zinc-950 border rounded-lg">
          <div className="h-[92%] w-full bg-white/10 rounded-md"></div>
            {messages  && <div>
              <span bg-white className="text-black rounded p-4 8">
                {messages}
              </span>
            </div>}
          <div className="h-[8%] w-full bg-white/10 rounded-md flex items-center px-0">
            <input type="text" placeholder="Type a message" className="text-white h-full w-[90%] px-2" />
            <button className="w-[10%] h-full text-white hover:cursor-pointer bg-zinc-950/80 hover:bg-zinc-950/76">Send</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App;