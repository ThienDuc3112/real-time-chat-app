import { useState } from "react";
import { NewRoomPopup } from "./newRoomPopup";
import { JoinRoomPopup } from "./joinRoomPopup";

const RoomOptions = () => {
  const [newRoomOpen, setNewRoomOpen] = useState(false);
  const [joinRoomOpen, setJoinRoomOpen] = useState(false);
  return (
    <div className="mt-4">
      <JoinRoomPopup open={joinRoomOpen} onClose={() => setJoinRoomOpen(false)}/>
      <NewRoomPopup open={newRoomOpen} onClose={() => setNewRoomOpen(false)} />
      <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-white hover:bg-gray-100 h-10 px-4 py-2 mr-2" onClick={() => setJoinRoomOpen(true)}>Join room</button>
      <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-black/80 h-10 px-4 py-2" onClick={() => setNewRoomOpen(true)}>New room</button>
    </div>
  );
};

export default RoomOptions;
