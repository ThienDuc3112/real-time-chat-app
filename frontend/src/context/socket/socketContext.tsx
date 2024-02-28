import { createContext } from "react";
import { socket } from "./socket";

export const SocketContext = createContext(socket);
