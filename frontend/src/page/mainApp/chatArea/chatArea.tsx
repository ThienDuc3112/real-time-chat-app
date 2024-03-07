import Input from "./input";
import MessageBubble from "./messageBubble";
import style from "./chatArea.module.css";
import { IRoom } from "../../../types/IRoom";
import { IMessage } from "../../../types/IMessage";
import TopBar from "./topBar";

const ChatArea = ({
  room,
  messages,
}: {
  room: IRoom | undefined;
  messages: IMessage[];
}) => {
  return (
    <div className={style.container}>
      <TopBar room={room} />
      <div className={style.messageList}>
        {messages.map((msg) => (
          <MessageBubble message={msg} key={msg.id} />
        ))}
      </div>
      <div>
        <Input focus={`${room?.id}`} />
      </div>
    </div>
  );
};

export default ChatArea;
