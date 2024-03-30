import { Dispatch, SetStateAction, createContext } from "react";
import { IRoom } from "../../types/IRoom";

export const RoomContext = createContext({
} as {
    rooms: { [key: string]: IRoom },
    updated: { [key: string]: boolean },
    setUpdated: Dispatch<SetStateAction<{ [key: string]: boolean }>>,
    joinRoom: (id: string) => Promise<boolean>,
    createRoom: (name: string) => Promise<boolean>,
    focus: string | undefined,
    setFocus: Dispatch<SetStateAction<string | undefined>>,
    editRoomName: (name: string, roomId: string) => Promise<boolean>,
    deleteRoom: (roomId: string) => Promise<boolean>,
})
