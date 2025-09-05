"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let allSockets = [];
wss.on("connection", function (socket) {
    allSockets.push(socket);
    console.log("User connected");
    // getting message from the client
    socket.on("message", (message) => {
        // responding back to the client 
        allSockets.forEach((eachCLient) => {
            if (eachCLient !== socket) {
                eachCLient.send(message.toString());
            }
        });
    });
    //! when people disconnects then keep only the people which are connected
    socket.on("close", () => {
        allSockets = allSockets.filter(x => x != socket);
    });
});
