import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IRoom } from "../types/IRoom";
import { API_URL } from "../constants";
import { getAccessToken } from "../util/getAccessToken";
import { get } from "../util/fetch";
import { socket } from "../context/socket";

export const useRoom = (): [
  { [key: string]: IRoom },
  { [key: string]: boolean },
  Dispatch<SetStateAction<{ [key: string]: boolean }>>
] => {
  const [rooms, setRooms] = useState({} as { [key: string]: IRoom });
  const [updated, setUpdated] = useState({} as { [key: string]: boolean });
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
  return [rooms, updated, setUpdated];
};
