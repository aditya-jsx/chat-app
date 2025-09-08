import "./index.css"
import { useEffect, useRef, useState } from "react";

function App() {

  const [socket, setSocket] = useState<WebSocket>();
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
    
  const [messages,setMessages] = useState([{
  text: "Welcome to the Chat",
    senderType: "other"
  }]);

  const autoScrollRef = useRef(true);

  useEffect(() => {
    if (autoScrollRef.current && messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  const handleScroll = () => {
    const container = messagesEndRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;

      const tolerance = 100;
      const atBottom = scrollHeight - scrollTop - clientHeight <= tolerance;

      // If user scrolls near bottom, re-enable auto-scroll.
      // If user scrolls up, disable auto-scroll.
      autoScrollRef.current = atBottom;
    }
  };
    
  useEffect(()=>{

    const ws = new WebSocket("ws://localhost:8080");
    setSocket(ws);

    ws.onmessage = (event) => {
      
      try{
        const parsedData = JSON.parse(event.data);
        
        if(parsedData.type === "chatMessage"){
          setMessages(m => [...m, {
            text: parsedData.content,
            senderType: parsedData.sender
          }])
        }
      }catch(e){
        console.log("Failed to parse the incoming data", e);
      }
    }

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: "red"
        }
      }))
    }

    return () => {
      console.log("closing the websocket connection")
      ws.close();
    }

  },[])

  const sendMessage = () => {
    if(inputRef.current && inputRef.current.value){
      socket?.send(JSON.stringify({
        type: "chat",
        payload: {
          message: inputRef.current.value
        }
      }));
      inputRef.current.value = "";
    }
  }

  return (
    <>
      <div className="h-screen w-full flex items-center justify-center gap-4 bg-zinc-950">
        <div className="h-[35rem] w-[50rem] flex flex-col items-center justify-between gap-4 p-4 text-white bg-zinc-950 border rounded-lg">
          <div className="h-full w-full bg-white/10 rounded-md px-3 py-5 flex flex-col gap-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          ref={messagesEndRef}
          onScroll={handleScroll}
          >
            {messages.map(message => 
            <div className={`flex ${message.senderType === "self"? "justify-end" : ""}`}>
              <span className={`text-black rounded p-2 ${message.senderType === "self"? "bg-blue-600 text-white" : "bg-white"}`}>
                {message.text}
              </span>
            </div>
              )
            }
          </div>
          <div className="h-[8%] w-full bg-white/10 rounded-md flex items-center px-0">
            <input ref={inputRef} type="text" placeholder="Type a message" className="text-white h-full w-[90%] px-2" />
            <button onClick={sendMessage} className="w-[10%] h-full text-white hover:cursor-pointer bg-zinc-950/80 hover:bg-zinc-950/60">Send</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App;