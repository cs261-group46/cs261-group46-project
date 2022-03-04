import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import CreateMeeting from "./CreateMeeting";

describe("<CreateMeeting />", () => {
  test("it should mount", () => {
    render(<CreateMeeting />);

    const createMeeting = screen.getByTestId("CreateMeeting");

    expect(createMeeting).toBeInTheDocument();
  });
});
