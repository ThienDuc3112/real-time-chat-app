import { FormEventHandler, useState } from "react";
import { useSocketContext } from "../../context/socket/useSocketContext";
import { getAccessToken } from "../../util/getAccessToken";
import style from "./input.module.css";

const Input = ({ focus }: { focus: string }) => {
  const socket = useSocketContext();
  const [message, setMessage] = useState("");
  const submitHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    socket.emit("sendMessage", {
      to: focus,
      content: message,
      accessToken: await getAccessToken(),
    });
    setMessage("");
  };
  return (
    <div className={style.inputArea}>
      <form onSubmit={submitHandler}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Input;