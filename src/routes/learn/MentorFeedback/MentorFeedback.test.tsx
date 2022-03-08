import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import MentorFeedback from "./MentorFeedback";
import { BrowserRouter } from "react-router-dom";

describe("<MentorFeedback />", () => {
  test("it should mount", () => {
    render(
      <BrowserRouter>
        <MentorFeedback />
      </BrowserRouter>
    );

    const mentorFeedback = screen.getByTestId("MentorFeedback");

    expect(mentorFeedback).toBeInTheDocument();
  });
});
