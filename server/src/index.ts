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
        const parsedMessage = JSON.parse(message);
        if(parsedMessage.type == "join"){
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId,
            })
        }

        if(parsedMessage.type == "chat"){
            // find the room of the user
            const currentUserRoom = allSockets.find((x)=>{x.socket == socket});

            // allSockets.map(() => {
            //     if(allSockets.room = currentUserRoom){
            //         allSockets.socket.send(parsedMessage.payload.message)
            //     }
            // })

            for(let i = 0; i < allSockets.length; i++){
                // @ts-ignore
                if(allSockets[i].room == currentUserRoom){
                    allSockets[i]?.socket.send(parsedMessage.payload.message);
                }
            }
        }
    })
})




































// let allSockets: WebSocket[] = [];

// interface Room {
//   sockets: WebSocket[];
// }

// const rooms: Record<string, Room> = {};

// wss.on("connection", function (ws) {

//     ws.on("message", function message(data:string){
//         // the data in the ws server always comes in the format of a string so we have to convert it into a string
//         const parsedData = JSON.parse(data);

//         // then we have to check whether the coming room is present in the rooms or not, if not then we add it
//         if(parsedData.type == "join-room"){
//             const room = parsedData.room;
//             if(!rooms[room]){
//                 rooms[room] = {
//                     sockets: []
//                 }
//             }
//             // if present then we push this specific socket into that romm
//             rooms[room].sockets.push(ws);
//         }
//         if(parsedData.type == "chat"){
//             const room = parsedData.room;
//             if(rooms[room]){
//                 rooms[room].sockets.map(socket => socket.send(data))
//             }
//             return null;
//         }
//     });


// });






















// allSockets.push(socket);
// console.log("User connected");

// // getting message from the client
// socket.on("message", (message) => {
//   // responding back to the client
//   allSockets.forEach((eachCLient) => {
//     if (eachCLient !== socket) {
//       eachCLient.send(message.toString());
//     }
//   });
// });

// //! when people disconnects then keep only the people which are connected
// socket.on("close", () => {
//   allSockets = allSockets.filter((x) => x != socket);
// });
