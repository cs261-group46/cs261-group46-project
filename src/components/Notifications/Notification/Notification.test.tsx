import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Notification from "./Notification";
import { NotificationType } from "../../../types/Notification";

describe("<Notification />", () => {
  test("it should mount", () => {
    render(
      <Notification
        notification={{
          id: 0,
          description: "",
          notification_level: "warning",
          notification_type: "",
        }}
        onRemove={function (notification: NotificationType<string>): void {
          throw new Error("Function not implemented.");
        }}
      />
    );

    const notification = screen.getByTestId("Notification");

    expect(notification).toBeInTheDocument();
  });
});
