import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import CreateMeeting from "./CreateMeeting";
import { BrowserRouter } from "react-router-dom";

describe("<CreateMeeting />", () => {
  test("it should mount", () => {
    render(
      <BrowserRouter>
        <CreateMeeting />
      </BrowserRouter>
    );

    const createMeeting = screen.getByTestId("CreateMeeting");

    expect(createMeeting).toBeInTheDocument();
  });
});
