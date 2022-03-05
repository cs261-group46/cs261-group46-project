import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import CreateGroupSession from "./CreateGroupSession";

describe("<CreateWorkshop />", () => {
  test("it should mount", () => {
    render(<CreateGroupSession />);

    const createWorkshop = screen.getByTestId("CreateGroupSession");

    expect(createWorkshop).toBeInTheDocument();
  });
});
