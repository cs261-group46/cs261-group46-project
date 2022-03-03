import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Event from "./Event";
import { EventProps } from "./Event.d";

describe("<Event />", () => {
  test("it should mount", () => {
    render(<Event event={{} as EventProps} />);

    const UpcomingEventsEvent = screen.getByTestId("Event");

    expect(UpcomingEventsEvent).toBeInTheDocument();
  });
});
