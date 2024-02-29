import { IRoom } from "../../types/IRoom";
import style from "./topbar.module.css";

const TopBar = ({ room }: { room: IRoom | undefined }) => {
  return (
    <div className={style.container}>
      <span>{room?.name ?? "Select a room"}</span>
      {room && <button>Invite someone</button>}
    </div>
  );
};

export default TopBar;
