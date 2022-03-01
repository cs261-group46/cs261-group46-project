import React, { FC } from "react";
import SystemMessage from "../../UI/SystemMessage/SystemMessage";
import styles from "./Notification.module.scss";
import { NotificationType } from "../../../types/Notification";
import { destroy } from "../../../api/api";

interface NotificationProps {
  notification: NotificationType<string>;
  onRemove: (notification: NotificationType<string>) => void;
}

const Notification: FC<NotificationProps> = (props) => {
  const removeNotificationHandler = () => {
    try {
      destroy({ resource: "notifications", entity: props.notification.id });
      props.onRemove(props.notification);
    } catch (errors) {
      console.log(errors);
    }
  };

  return (
    <div className={styles.Notification} data-testid="Notification">
      <SystemMessage
        key={props.notification.id}
        sort={"inline"}
        type={props.notification.notification_level}
        description={props.notification.description}
        visible={true}
        onClose={removeNotificationHandler}
      />
    </div>
  );
};

export default Notification;
