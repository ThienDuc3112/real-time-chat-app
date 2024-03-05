import { useState } from "react";
import { NewRoomPopup } from "./createNewRoom/newRoomPopup";

const NewRoom = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <NewRoomPopup open={open} onClose={() => setOpen(false)} />
      <button onClick={() => setOpen(true)}>New room</button>
    </>
  );
};

export default NewRoom;
