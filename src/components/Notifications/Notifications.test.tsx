import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Notifications from "./Notifications";
import { NotificationType } from "../../types/Notification";

describe("<Notifications />", () => {
  const testNotification: NotificationType<string> = {
    id: 0,
    notification_type: "type",
    notification_level: "warning",
    description: "Test Notification",
  };

  var notificationsList: NotificationType<string>[] = [testNotification];
  const removeNotification = (notification: NotificationType<string>) =>
    notificationsList.splice(notificationsList.indexOf(notification));

  const notificationsElement = (
    <Notifications
      notifications={notificationsList}
      onRemove={removeNotification}
    />
  );

  test("it should mount", () => {
    render(notificationsElement);

    const notifications = screen.getByTestId("Notifications");

    expect(notifications).toBeInTheDocument();
  });

  it("should display notification test", () => {
    render(notificationsElement);

    const notifications = screen.getByTestId("Notifications");

    expect(notifications).toHaveTextContent("Test Notification");
  });

  it("should not display notification when function is called", () => {
    removeNotification(testNotification);

    render(notificationsElement);

    const notifications = screen.getByTestId("Notifications");

    expect(notifications).not.toHaveTextContent("Test Notification");
  });
});
