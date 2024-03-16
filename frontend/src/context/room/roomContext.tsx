import { Dispatch, SetStateAction, createContext } from "react";
import { IRoom } from "../../types/IRoom";

export const RoomContext = createContext({
} as {
    rooms: { [key: string]: IRoom },
    updated: { [key: string]: boolean },
    setUpdated: Dispatch<SetStateAction<{ [key: string]: boolean }>>,
    joinRoom: (id: string) => Promise<boolean>,
    createRoom: (name: string) => Promise<boolean>
})
