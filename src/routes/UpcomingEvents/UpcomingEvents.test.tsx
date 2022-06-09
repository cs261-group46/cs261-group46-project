import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import UpcomingEvents from "./UpcomingEvents";
import { BrowserRouter } from "react-router-dom";

describe("<UpcomingEvents />", () => {
  test("it should mount", () => {
    render(
      <BrowserRouter>
        <UpcomingEvents>Testing</UpcomingEvents>
      </BrowserRouter>
    );

    const upcomingEvents = screen.getByTestId("UpcomingEvents");

    expect(upcomingEvents).toBeInTheDocument();
  });
});
