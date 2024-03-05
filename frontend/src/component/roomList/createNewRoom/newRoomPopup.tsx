import { useState } from "react";

export const NewRoomPopup = () => {
  // Create a dialog box that create a new room
  // The dialog box should have a input field for the room name
  // The dialog box should have a button for creating the room
  // The dialog box should have a button for canceling the creation
  // The dialog box should have a button for closing the dialog box
  const [name, setName] = useState("");
  return (
    <dialog>
      <p>create a new room</p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        name="name"
        placeholder="Room name"
      />
      <button>create</button>
      <button>cancel</button>
      <button>close</button>
    </dialog>
  );
};
