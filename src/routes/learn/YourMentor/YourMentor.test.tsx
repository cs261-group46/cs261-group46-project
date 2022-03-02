import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import YourMentor from "./YourMentor";
import { BrowserRouter } from "react-router-dom";

describe("<YourMentor />", () => {
  test("it should mount", () => {
    render(
      <BrowserRouter>
        <YourMentor />
      </BrowserRouter>
    );

    const yourMentor = screen.getByTestId("YourMentor");

    expect(yourMentor).toBeInTheDocument();
  });
});
