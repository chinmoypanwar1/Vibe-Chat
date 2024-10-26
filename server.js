// import express from "express"
// import { Server } from "socket.io"
// import { createServer } from "http"
// import cors from "cors"

// const port = 5173
// const app = express()
// app.use(cors({
//     origin : "http://localhost:5173",
//     methods : ["GET","POST"],
//     credentials : true
// }))

// const server = createServer(app)
// const io = new Server(server, {
//     cors : {
//         origin : "http://localhost:5173",
//         methods : ["GET","POST"],
//         credentials : true
//     }
// })

// io.on("connection", (socket) => {

//     console.log("User connected", socket.id)
//     const socketId = socket.id
//     socket.on("message", ({room, message}) => {
//         socket.to(room).emit("recieve-message", {message, socketId})
//         console.log(message)
//     })

//     socket.on("disconnect", () => {
//         console.log(`User Disconnected : ${socket.id}`)
//     })
// })


// server.listen(port, () => {
//     console.log("The server has been started.")
// })

// server.js
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const port = 3000;

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("message", ({ room, message }) => {
      socket.to(room).emit("recieve-message", { message, socketId: socket.id });
      console.log(message);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

server.listen(port, (err) => {
    if (err) throw err;
    console.log(`Server is running on http://localhost:${port}`);
  });
  
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
  
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
});
