import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import CreateGroupSession from "./CreateGroupSession";
import { BrowserRouter } from "react-router-dom";

describe("<CreateWorkshop />", () => {
  test("it should mount", () => {
    render(
      <BrowserRouter>
        <CreateGroupSession />
      </BrowserRouter>
    );

    const createWorkshop = screen.getByTestId("CreateGroupSession");

    expect(createWorkshop).toBeInTheDocument();
  });
});
