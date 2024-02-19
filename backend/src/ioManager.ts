import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export const setUpListener = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  io.on("connection", (socket) => {
    console.log(
      `New connection ${socket.data}\t Client count: ${io.engine.clientsCount}`
    );
    socket.join("public");
  });
};
