import "./index.css"
import { useEffect, useRef, useState } from "react";

function App() {

  const [socket, setSocket] = useState();
  const inputRef = useRef<HTMLInputElement>();
  const [data, setData] = useState();
 
  function sendMessage(){
    
    // @ts-ignore
    const message = inputRef.current.value;

    // @ts-ignore
    socket.send(message);
    
  }

  useEffect(()=>{
    const ws = new WebSocket("ws://localhost:8080");
    // @ts-ignore
    setSocket(ws);

    ws.onmessage = (e)=>{
      setData(e.data);
    }
  }, [])

  return (
    <>
      <div className="h-screen w-full flex items-center bg-zinc-950 justify-center">
        <div className="h-72 w-88 border rounded-lg bg-zinc-900/90  flex flex-col items-center justify-center gap-8">
          <div className="flex gap-6">
            <input ref={inputRef} type="text" placeholder="message..." className="bg-white/50 rounded-md p-2"  />
            <button className="text-white p-2 border border-white rounded-lg cursor-pointer hover:bg-white hover:text-black transition duration-300" onClick={sendMessage}>
              Send
            </button>
          </div>
          <div className="flex gap-4 items-center">
            <h1 className="text-white">Response - </h1>
            <div className="p-4 bg-gray-700 rounded-lg text-white">
              {data}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App;