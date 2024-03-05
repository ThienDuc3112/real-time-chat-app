import { useState } from "react";
import PopupDialog from "../../popupDialog";
// import { IUser } from "../../../types/IUser";

export const NewRoomPopup = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [name, setName] = useState("");
  const [user, setUser] = useState("");
  //   const [users, setUsers] = useState([] as IUser[]);
  return (
    <PopupDialog open={open} onClose={onClose}>
      <p>Create a new room</p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        name="name"
        placeholder="Room name"
      />
      <input
        type="text"
        name="invite"
        value={user}
        onChange={(e) => setUser(e.target.value)}
        placeholder="Invite user"
      />
      {/* <div>{users.map((user) => user.username).join(", ")}</div> */}
      <button>create</button>
    </PopupDialog>
  );
};
