import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import YourWorkshops from "./YourGroupSessions";
import { BrowserRouter } from "react-router-dom";

describe("<YourWorkshops />", () => {
  test("it should mount", () => {
    render(
      <BrowserRouter>
        <YourWorkshops />
      </BrowserRouter>
    );

    const yourWorkshops = screen.getByTestId("YourWorkshops");

    expect(yourWorkshops).toBeInTheDocument();
  });
});
