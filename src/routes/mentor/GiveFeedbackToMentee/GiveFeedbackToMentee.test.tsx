import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import GiveFeedbackToMentee from "./GiveFeedbackToMentee";
import { BrowserRouter } from "react-router-dom";

describe("<GiveFeedbackToMentee />", () => {
  test("it should mount", () => {
    render(
      <BrowserRouter>
        <GiveFeedbackToMentee />
      </BrowserRouter>
    );

    const giveFeedbackToMentee = screen.getByTestId("GiveFeedbackToMentee");

    expect(giveFeedbackToMentee).toBeInTheDocument();
  });
});
