import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    socket: WebSocket;
    room: string;
}

let allSockets: User[] = [];

wss.on("connection", (socket) => {

    console.log("User Connected")

    socket.on("message", (message:string)=>{
        let parsedMessage;
        try{
            parsedMessage = JSON.parse(message);
        }catch(e){
            console.log("Failed to parse the JSON or invalid JSON format", e);
            return;
        }


        if(parsedMessage.type == "join" && parsedMessage.payload?.roomId){
            const existingUser = allSockets.find(user => user.socket === socket);
            if(existingUser){
                existingUser.room = parsedMessage.payload.roomId;
            }else{
                allSockets.push({
                    socket,
                    room: parsedMessage.payload.roomId,
                })
            }
        }

        if(parsedMessage.type == "chat"){
            // find the room of the user
            const sender = allSockets.find(user => user.socket === socket);

            if(sender){
                const senderRoom = sender.room;
                const chatMessageContent = parsedMessage.payload.message;

                const messagePayload = {
                    type: "chatMessage",
                    content: chatMessageContent,
                    sender: "other"
                };

                // const message = messagePayload.content;

                allSockets.forEach(user => {
                    if(user.room === senderRoom){
                        user.socket.send(JSON.stringify(messagePayload));
                    }
                })
            }
        }

    socket.on("close", () => {
        allSockets = allSockets.filter((user) => user.socket !== socket);
    })
}
)})