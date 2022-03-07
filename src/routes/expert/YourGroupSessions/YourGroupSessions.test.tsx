import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import YourGroupSessions from "./YourGroupSessions";
import { BrowserRouter } from "react-router-dom";

describe("<YourGroupSessions />", () => {
  test("it should mount", () => {
    render(
      <BrowserRouter>
        <YourGroupSessions />
      </BrowserRouter>
    );

    const yourWorkshops = screen.getByTestId("YourGroupSessions");

    expect(yourWorkshops).toBeInTheDocument();
  });
});
