import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import StarPicker from "./StarPicker";

describe("<StarPicker />", () => {
  test("it should mount", () => {
    render(
      <StarPicker
        label={"test"}
        isValid={true}
        value={undefined}
        id={"stars"}
        onChange={() => {}}
        onBlur={() => {}}
      />
    );

    const starPicker = screen.getByTestId("StarPicker");

    expect(starPicker).toBeInTheDocument();
  });
});
