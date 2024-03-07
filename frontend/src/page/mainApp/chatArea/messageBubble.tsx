import { IMessage } from "../../../types/IMessage";
import style from "./messageBubble.module.css";

const MessageBubble = ({ message }: { message: IMessage }) => {
  return (
    <div className={style.container}>
      <div className={style.metadata}>
        {message.username}
        {" - "}
        {new Date(message.timestamp).toLocaleDateString()}
      </div>
      <div className={style.content}>{message.content}</div>
    </div>
  );
};

export default MessageBubble;
