import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import CreateWorkshop from "./CreateWorkshop";
import { BrowserRouter } from "react-router-dom";

describe("<CreateWorkshop />", () => {
  test("it should mount", () => {
    render(
      <BrowserRouter>
        <CreateWorkshop />
      </BrowserRouter>
    );

    const createWorkshop = screen.getByTestId("CreateWorkshop");

    expect(createWorkshop).toBeInTheDocument();
  });
});
