import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { sendMessage } from "./listeners/sendMessage";
import { joinAllRooms } from "./listeners/joinAllRooms";

export const setUpListener = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  io.on("connection", (socket) => {
    console.log(
      `New connection ${socket.id}\t Client count: ${io.engine.clientsCount}`
    );
    socket.on("disconnect", (reason) => {
      console.log(
        `${socket.id} disconnected\t Client count: ${io.engine.clientsCount}`
      );
      console.log(`Reason: ${reason}`);
    });
    socket.join("public");
    sendMessage(io, socket);
    joinAllRooms(io, socket);
  });
};
