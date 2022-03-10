import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import PastMentors from "./PastMentors";
import { BrowserRouter } from "react-router-dom";

describe("<PastMentors />", () => {
  test("it should mount", () => {
    render(
      <BrowserRouter>
        <PastMentors />
      </BrowserRouter>
    );

    const pastMentors = screen.getByTestId("PastMentors");

    expect(pastMentors).toBeInTheDocument();
  });
});
