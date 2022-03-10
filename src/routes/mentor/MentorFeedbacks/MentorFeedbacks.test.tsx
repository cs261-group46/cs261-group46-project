import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import MentorFeedbacks from "./MentorFeedbacks";
import { BrowserRouter } from "react-router-dom";

describe("<MentorFeedbacks />", () => {
  test("it should mount", () => {
    render(
      <BrowserRouter>
        <MentorFeedbacks />
      </BrowserRouter>
    );

    const mentorFeedbacks = screen.getByTestId("MentorFeedbacks");

    expect(mentorFeedbacks).toBeInTheDocument();
  });
});
