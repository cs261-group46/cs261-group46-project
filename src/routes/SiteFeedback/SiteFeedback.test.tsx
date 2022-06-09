import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import SiteFeedback from "./SiteFeedback";
import { BrowserRouter } from "react-router-dom";

describe("<SiteFeedback />", () => {
  test("it should mount", () => {
    render(
      <BrowserRouter>
        <SiteFeedback />
      </BrowserRouter>
    );

    const siteFeedback = screen.getByTestId("SiteFeedback");

    expect(siteFeedback).toBeInTheDocument();
  });
});
