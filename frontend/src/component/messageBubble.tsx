import { IMessage } from "../types/IMessage";

const MessageBubble = ({message}:{message: IMessage}) => {

  return <div>{
        message.content
 }</div>;
};

export default MessageBubble;
