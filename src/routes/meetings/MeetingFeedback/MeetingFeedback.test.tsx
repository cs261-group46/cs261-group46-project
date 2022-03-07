import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import MeetingFeedback from "./MeetingFeedback";

describe("<MeetingFeedback />", () => {
  test("it should mount", () => {
    render(<MeetingFeedback />);

    const meetingFeedback = screen.getByTestId("MeetingFeedback");

    expect(meetingFeedback).toBeInTheDocument();
  });
});
