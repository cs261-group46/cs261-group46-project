import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import MenteeFeedbacks from "./MenteeFeedbacks";
import { BrowserRouter } from "react-router-dom";

describe("<MenteeFeedbacks />", () => {
  test("it should mount", () => {
    render(
      <BrowserRouter>
        <MenteeFeedbacks />
      </BrowserRouter>
    );

    const menteeFeedbacks = screen.getByTestId("MenteeFeedbacks");

    expect(menteeFeedbacks).toBeInTheDocument();
  });
});
