import { IMessage } from "../../types/IMessage";
import style from "./messageBubble.module.css";

const MessageBubble = ({message}:{message: IMessage}) => {
  return <div className={style.container}>{
        message.content
 }</div>;
};

export default MessageBubble;
