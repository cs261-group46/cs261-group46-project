import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import MentorFeedback from "./MentorFeedback";

describe("<MentorFeedback />", () => {
  test("it should mount", () => {
    render(<MentorFeedback />);

    const mentorFeedback = screen.getByTestId("MentorFeedback");

    expect(mentorFeedback).toBeInTheDocument();
  });
});
