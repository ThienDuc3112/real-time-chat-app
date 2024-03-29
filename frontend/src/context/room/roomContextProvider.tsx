import { ReactNode, useCallback, useEffect, useState } from "react";
import { socket } from "../socket";
import { RoomContext } from "./roomContext"
import { IRoom } from "../../types/IRoom";
import { getAccessToken } from "../../util/getAccessToken"
import { API_URL } from "../../constants";
import { get, post } from "../../util/fetch";

export const RoomContextProvider = ({ children }: { children: ReactNode }) => {
    const [rooms, setRooms] = useState({} as { [key: string]: IRoom });
    const [updated, setUpdated] = useState({} as { [key: string]: boolean });
    const [focus, setFocus] = useState(undefined as string | undefined);
    const joinRoom = async (id: string): Promise<boolean> => {
        const token = await getAccessToken()
        let joinLink = ""
        try {
            joinLink = `${API_URL}/room/join/${BigInt(id).toString()}`
        }
        catch (err) {
            joinLink = id
        }
        const [data, err] = await get<IRoom>(joinLink, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (!err) {
            setRooms(prev => ({ ...prev, [data.id]: data }))
            socket.emit("joinRoom", ({ accessToken: await getAccessToken(), roomId: data.id }))
            setFocus(data.id)
            return true
        }
        return false
    }
    const createRoom = useCallback(async (name: string): Promise<boolean> => {
        const token = await getAccessToken()
        const [data, err] = await post<IRoom>(`${API_URL}/room/create`, {
            body: JSON.stringify({ name: name }),
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json"
            }
        })
        if (!err) {
            setRooms(prev => ({ ...prev, [data.id]: data }))
            socket.emit("joinRoom", ({ accessToken: await getAccessToken(), roomId: data.id }))
            setFocus(data.id)
            return true
        }
        return false
    }, [])
    useEffect(() => {
        getAccessToken().then(async (token) => {
            const [data, err] = await get<IRoom[]>(`${API_URL}/room/getallroom`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!err) {
                const initialRooms = {} as { [key: string]: IRoom };
                const initialUpdated = {} as { [key: string]: boolean };
                data.forEach((room) => {
                    initialRooms[room.id] = room;
                    initialUpdated[room.id] = false;
                });
                setRooms(initialRooms);
                setUpdated(initialUpdated);
            }
            socket.emit("joinAllRoom", token);
            socket.on("roomJoined", (room: IRoom) => {
                setRooms((prev) => ({ ...prev, [room.id]: room }));
                setUpdated((prev) => ({ ...prev, [room.id]: false }));
            });
        });
        return () => {
            socket.off("roomJoined");
        };
    }, []);
    return <RoomContext.Provider value={{
        rooms, updated, setUpdated, joinRoom, createRoom, focus, setFocus
    }
    }>{children}</RoomContext.Provider>
}
