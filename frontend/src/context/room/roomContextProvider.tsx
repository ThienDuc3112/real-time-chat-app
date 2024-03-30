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
    const editRoomName = async (name: string, roomId: string): Promise<boolean> => {
        const token = await getAccessToken()
        const [, err] = await post<IRoom>(`${API_URL}/room/editname/${roomId}`, {
            body: JSON.stringify({ name: name }),
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json"
            },
            method: "PUT"
        })
        if (!err) return true
        else return false
    }
    const deleteRoom = async (roomId: string): Promise<boolean> => {
        const token = await getAccessToken()
        const [, err] = await post(`${API_URL}/room/delete/${roomId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            method: "DELETE"
        })
        if (!err) return true
        else return false

    }
    useEffect(() => {
        socket.on("updateName", ({ id, newName }: { id: string, newName: string }) => {
            setRooms(prev => {
                if (prev[id] != undefined) {
                    return { ...prev, [id]: { ...prev[id], name: newName } }
                } else return prev;
            })
        })
        socket.on("roomJoined", (room: IRoom) => {
            setRooms((prev) => ({ ...prev, [room.id]: room }));
            setUpdated((prev) => ({ ...prev, [room.id]: false }));
        });
        socket.on("roomDeleted", (room: Pick<IRoom, "id" | "name" | "roomType">) => {
            setRooms(prev => {
                if(prev[room.id] === undefined) return prev;
                else {
                    const {[room.id]: _, ...theRest} = prev;
                    return theRest;
                }
            })
            setFocus(prev => {
                if(prev == room.id) return undefined;
                else return prev;
            })
        })
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
        });
        return () => {
            socket.off("roomJoined");
            socket.off("updateName");
        };
    }, []);
    return <RoomContext.Provider value={{
        rooms, updated, setUpdated, joinRoom, createRoom, focus, setFocus, editRoomName, deleteRoom
    }
    }>{children}</RoomContext.Provider>
}
