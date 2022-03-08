import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import YourProfile from "./YourProfile";
import { BrowserRouter } from "react-router-dom";

describe("<YourProfile />", () => {
  test("it should mount", () => {
    render(
      <BrowserRouter>
        <YourProfile />
      </BrowserRouter>
    );

    const yourProfile = screen.getByTestId("YourProfile");

    expect(yourProfile).toBeInTheDocument();
  });
});
