import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import MenteeFeedback from "./MenteeFeedback";

describe("<MenteeFeedback />", () => {
  test("it should mount", () => {
    render(<MenteeFeedback />);

    const menteeFeedback = screen.getByTestId("MenteeFeedback");

    expect(menteeFeedback).toBeInTheDocument();
  });
});
