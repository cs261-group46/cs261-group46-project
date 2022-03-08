import { FC } from "react";
import styles from "./Notifications.module.scss";
import { NotificationType } from "../../types/Notification";
import Notification from "./Notification/Notification";

interface NotificationsProps {
  notifications: NotificationType<string>[];
  onRemove: (notification: NotificationType<string>) => void;
}

const Notifications: FC<NotificationsProps> = (props) => {
  const notifications = props.notifications.map((notification) => (
    <Notification
      key={notification.id}
      onRemove={props.onRemove}
      notification={notification}
    />
  ));

  return (
    <div className={styles.Notifications} data-testid="Notifications">
      {notifications}
    </div>
  );
};

export default Notifications;
