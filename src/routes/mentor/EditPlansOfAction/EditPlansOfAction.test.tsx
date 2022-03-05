import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import EditPlansOfAction from "./EditPlansOfAction";
import { BrowserRouter } from "react-router-dom";

describe("<EditPlansOfAction />", () => {
  test("it should mount", () => {
    render(
      <BrowserRouter>
        <EditPlansOfAction />
      </BrowserRouter>
    );

    const editPlansOfAction = screen.getByTestId("EditPlansOfAction");

    expect(editPlansOfAction).toBeInTheDocument();
  });
});
