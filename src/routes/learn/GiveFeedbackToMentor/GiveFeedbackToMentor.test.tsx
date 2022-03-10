import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import GiveFeedbackToMentor from "./GiveFeedbackToMentor";
import { BrowserRouter } from "react-router-dom";

describe("<GiveFeedbackToMentor />", () => {
  test("it should mount", () => {
    render(
      <BrowserRouter>
        <GiveFeedbackToMentor />
      </BrowserRouter>
    );

    const giveFeedbackToMentor = screen.getByTestId("GiveFeedbackToMentor");

    expect(giveFeedbackToMentor).toBeInTheDocument();
  });
});
