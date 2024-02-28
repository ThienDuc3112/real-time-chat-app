import { ReactNode } from "react";
import { SocketContext } from "./socketContext";
import { socket } from "./socket";

export const SocketContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
