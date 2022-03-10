import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import GiveFeedbackForMeeting from "./GiveFeedbackForMeeting";
import { BrowserRouter } from "react-router-dom";

describe("<GiveFeedbackForMeeting />", () => {
  test("it should mount", () => {
    render(
      <BrowserRouter>
        <GiveFeedbackForMeeting />
      </BrowserRouter>
    );

    const giveFeedbackForMeeting = screen.getByTestId("GiveFeedbackForMeeting");

    expect(giveFeedbackForMeeting).toBeInTheDocument();
  });
});
