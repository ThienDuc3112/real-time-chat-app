import { useState } from "react";
import { NewRoomPopup } from "./createNewRoom/newRoomPopup";
import { JoinRoomPopup } from "./joinRoom/joinRoomPopup";

const RoomOptions = () => {
  const [newRoomOpen, setNewRoomOpen] = useState(false);
  const [joinRoomOpen, setJoinRoomOpen] = useState(false);
  return (
    <div>
      <JoinRoomPopup open={joinRoomOpen} onClose={() => setJoinRoomOpen(false)}/>
      <NewRoomPopup open={newRoomOpen} onClose={() => setNewRoomOpen(false)} />
      <button style={{width: "100%"}} onClick={() => setJoinRoomOpen(true)}>Join room</button>
      <button style={{width: "100%"}} onClick={() => setNewRoomOpen(true)}>New room</button>
    </div>
  );
};

export default RoomOptions;
