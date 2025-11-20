import dotenv from "dotenv";
import { app } from "./app.js";
import { connectToDatabase } from "./config/db.js";
import http from "http";
import { Server } from "socket.io";
dotenv.config();
connectToDatabase()
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.listen(process.env.PORT,()=>{
    console.log(`server is listen at port number ${process.env.PORT}`)
})