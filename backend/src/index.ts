import express from "express";
import cors from "cors";
import { createServer } from "http";
import { config } from "dotenv";
import { Server } from "socket.io";
import { userRouter } from "./routes/user";
import cookieParser from "cookie-parser";
import { setUpListener } from "./ioManager";
import { roomRouter } from "./routes/room";

config();

export const app = express();

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/up", (_, res) => {
  res.send();
});

app.use("/user", userRouter);
app.use("/room", roomRouter);

const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

setUpListener(io);

server.listen(process.env.PORT ?? 6969, () => {
  console.log(`Server listen on ${process.env.PORT ?? 6969}`);
});
