import React, { FC } from "react";
import ReactDOM from "react-dom";
import styles from "./SystemMessage.module.scss";

interface SystemMessageProps {
  sort: "popup" | "inline";
  type: "warning" | "alert" | "info" | "success";
  description: string;
  visible: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
}

const SystemMessage: FC<SystemMessageProps> = (props) => {
  const closeHandler = () => {
    if (props.onClose) props.onClose();
  };

  if (props.sort === "inline" && props.visible) {
    return (
      <div
        className={
          styles.SystemMessage +
          " " +
          (props.type === "warning" ? styles.warning : "") +
          " " +
          (props.type === "alert" ? styles.alert : "") +
          " " +
          (props.type === "info" ? styles.information : "") +
          " " +
          (props.type === "success" ? styles.success : "")
        }
        data-testid="SystemMessage"
      >
        {props.onClose && (
          <span className={styles.span} onClick={closeHandler}>
            &#10006;
          </span>
        )}
        <h1 className={styles.h1}>{props.type}</h1>
        <p className={styles.p}>{props.description}</p>
      </div>
    );
  } else if (props.sort === "popup" && props.visible) {
    return ReactDOM.createPortal(
      <div className={styles.PopUpModal}>
        <div
          className={
            styles.PopUpSystemMessage +
            " " +
            (props.type === "warning" ? styles.warning : "") +
            " " +
            (props.type === "alert" ? styles.alert : "") +
            " " +
            (props.type === "info" ? styles.information : "")
          }
          data-testid="SystemMessage"
        >
          {props.onClose && (
            <span className={styles.span} onClick={closeHandler}>
              &#10006;
            </span>
          )}
          <h1 className={styles.h1}>{props.type}</h1>
          <p className={styles.p}>{props.description}</p>
          {props.children}
        </div>
      </div>,
      document.getElementById("modal-root")!
    );
  }

  return null;
};

export default SystemMessage;
