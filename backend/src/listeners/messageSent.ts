import { TEventHandler } from "../interfaces/TEventHandler";

export const messageSentRegister: TEventHandler = (io, socket) => {
  socket.on("messageSent", (action: any) => {
    console.log(action);
  });
};
