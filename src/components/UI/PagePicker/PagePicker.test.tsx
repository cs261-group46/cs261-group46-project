import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import PagePicker from "./PagePicker";

describe("<PagePicker />", () => {
  test("it should mount", () => {
    render(
      <PagePicker
        pickers={[]}
        buttons={{
          buttonLeft: function (): void {
            throw new Error("Function not implemented.");
          },
          buttonRight: function (): void {
            throw new Error("Function not implemented.");
          },
        }}
      />
    );

    const pagePicker = screen.getByTestId("PagePicker");

    expect(pagePicker).toBeInTheDocument();
  });
});
