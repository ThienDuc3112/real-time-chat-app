import { useState } from "react";
import { IRoom } from "../../../types/IRoom";
import style from "./topbar.module.css";
import InvitePopup from "./invitePopup/invitePopup";

const TopBar = ({ room }: { room: IRoom | undefined }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className={style.container}>
            <InvitePopup open={open} onClose={() => setOpen(false)} roomId={room?.id ?? ""}/>
            <span>{room?.name ?? "Select a room"}</span>
            {room && <button onClick={() => setOpen(true)}>Create invite link</button>}
        </div>
    );
};

export default TopBar;
