import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Notifications from "./Notifications";
import { NotificationType } from "../../types/Notification";

describe("<Notifications />", () => {
  test("it should mount", () => {
    render(
      <Notifications
        notifications={[]}
        onRemove={function (notification: NotificationType<string>): void {
          throw new Error("Function not implemented.");
        }}
      />
    );

    const notifications = screen.getByTestId("Notifications");

    expect(notifications).toBeInTheDocument();
  });
});
