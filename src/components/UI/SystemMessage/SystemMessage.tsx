import React, { FC } from "react";
import styles from "./SystemMessage.module.scss";

interface SystemMessageProps {
  sort: "popup" | "inline";
  type: "warning" | "alert" | "information";
  description: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const SystemMessage: FC<SystemMessageProps> = (props) => {
  return (
    <div className={styles.SystemMessage} data-testid="SystemMessage">
      SystemMessage Component
    </div>
  );
};

export default SystemMessage;
