import style from "./roomCard.module.css";

const ChatRoomCard = ({
  name,
  id,
  setFocus,
}: {
  name: string;
  id: string;
  setFocus: (id: string) => void;
}) => {
  return (
    <button
      className={style.card}
      onClick={() => {
        setFocus(id);
        return;
      }}
    >
      {name}
    </button>
  );
};

export default ChatRoomCard;
