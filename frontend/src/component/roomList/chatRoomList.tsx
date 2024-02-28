import { IRoom } from "../../types/IRoom";
import ChatRoomCard from "./roomCard";
import style from "./chatRoomList.module.css";
import NewRoom from "./newRoom";

const ChatRoomList = ({
  rooms,
  setFocus,
}: {
  rooms: {
    [keys: string]: IRoom;
  };
  setFocus: (id: string) => void;
}) => {
  return (
    <div>
      <div className={style.container}>
        {Object.keys(rooms).map((roomId) => {
          const room = rooms[roomId];
          return (
            <ChatRoomCard
              name={room.name}
              id={room.id}
              setFocus={setFocus}
              key={room.id}
            />
          );
        })}
      </div>
      <NewRoom />
    </div>
  );
};

export default ChatRoomList;
