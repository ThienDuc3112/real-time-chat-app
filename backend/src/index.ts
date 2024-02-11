import express from "express";
import cors from "cors";
import { createServer } from "http";
import { config } from "dotenv";
import { Server } from "socket.io";
// import mongoose from "mongoose";

config();

// mongoose.connect(process.env.MONGO_URL as string);
// const db = mongoose.connection;
// db.once("open", () => {
//   console.log("Connected to db");
// });
// db.on("error", (err) => {
//   console.error(err);
// });

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/up", (req, res) => {
  res.send();
});

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`New connection ${socket.data}`);
  socket.join("public");
});

server.listen(process.env.PORT ?? 6969, () => {
  console.log(`Server listen on ${process.env.PORT ?? 6969}`);
});
