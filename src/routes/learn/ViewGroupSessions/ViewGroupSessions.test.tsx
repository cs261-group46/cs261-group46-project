import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ViewGroupSessions from "./ViewGroupSessions";
import { BrowserRouter } from "react-router-dom";

describe("<ViewGroupSessions />", () => {
  test("it should mount", () => {
    render(
      <BrowserRouter>
        <ViewGroupSessions />
      </BrowserRouter>
    );

    const viewWorkshops = screen.getByTestId("ViewGroupSessions");

    expect(viewWorkshops).toBeInTheDocument();
  });
});
