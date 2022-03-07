import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Meetings from "./Meetings";
import { BrowserRouter } from "react-router-dom";

describe("<Meetings />", () => {
  test("it should mount", () => {
    render(
      <BrowserRouter>
        <Meetings />
      </BrowserRouter>
    );

    const meetings = screen.getByTestId("Meetings");

    expect(meetings).toBeInTheDocument();
  });
});
