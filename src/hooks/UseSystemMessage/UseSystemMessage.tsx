import { useContext } from "react";
import SystemMessagesContext from "../../store/SystemMessagesContext";

const UseSystemMessage = () => {
  const messageSystemCtx = useContext(SystemMessagesContext);
  return messageSystemCtx.addMessageHandler;
};

export default UseSystemMessage;
