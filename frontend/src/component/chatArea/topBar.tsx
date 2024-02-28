import { IRoom } from "../../types/IRoom";

const TopBar = ({ room }: { room: IRoom | undefined }) => {
  return (
    <div>
      <span>{room?.name ?? "Select a room"}</span>
      {room && <button>Invite someone</button>}
    </div>
  );
};

export default TopBar;
