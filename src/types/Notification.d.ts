export type NotificationType<T> = {
  id: number;
  description: string;
  notification_level: "warning" | "info" | "alert";
  notification_type: T;
};
