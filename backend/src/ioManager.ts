import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { sendMessage } from "./listeners/sendMessage";
import { joinAllRooms } from "./listeners/joinAllRooms";

export const setUpListener = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  io.on("connection", (socket) => {
    console.log(
      `New connection ${socket.data}\t Client count: ${io.engine.clientsCount}`
    );
    socket.join("public");
    sendMessage(io, socket);
    joinAllRooms(io, socket);
  });
};
