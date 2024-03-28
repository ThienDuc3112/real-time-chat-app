import { IRoom } from "../../../types/IRoom";

const TopBar = ({ room }: { room: IRoom | undefined }) => {
    return (
        <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">{room?.name ?? "Select a room"}</h2>
        </div>
    );
};

export default TopBar;
