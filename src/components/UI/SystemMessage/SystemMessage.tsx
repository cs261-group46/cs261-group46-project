import React, { FC } from "react";
import styles from "./SystemMessage.module.scss";

interface SystemMessageProps {
  sort: "popup" | "inline";
  type: "warning" | "alert" | "information";
  description: string;
  children?: React.ReactNode;
  onClose: (hello: string) => void;
}

const SystemMessage: FC<SystemMessageProps> = (props) => {
  const closeHandler = () => {
    props.onClose("hello world");
  };

  return (
    <div className={styles.SystemMessage} data-testid="SystemMessage">
      <button onClick={closeHandler}>X</button>
      <h1>{props.type}</h1>
      <p>{props.description}</p>
      {props.children}
    </div>
  );
};

export default SystemMessage;
