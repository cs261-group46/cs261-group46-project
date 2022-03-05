import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ExpertSignup from "./ExpertSignup";
import { BrowserRouter } from "react-router-dom";

describe("<ExpertSignup />", () => {
  test("it should mount", () => {
    render(
      <BrowserRouter>
        <ExpertSignup />
      </BrowserRouter>
    );

    const expertSignup = screen.getByTestId("ExpertSignup");

    expect(expertSignup).toBeInTheDocument();
  });
});
