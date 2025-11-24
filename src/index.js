import app from "./app.js";
import http from "http";
import { Server } from "socket.io";

const server = http.createServer(app);
export const io = new Server(server);

io.on("connection", (socket) => {
  console.log("Cliente conectado por websocket");
});

server.listen(3000, () => {
  console.log("Servidor escuchando en http://localhost:3000");
});