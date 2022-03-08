import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Card from "./Card";

describe("<Card />", () => {
  test("it should mount", () => {
    render(<Card children={""} />);

    const card = screen.getByTestId("Card");

    expect(card).toBeInTheDocument();
  });

  it("should contain the specified children", () => {
    render(
      <Card>
        <h1>Test1</h1>
        <p>Test2</p>
      </Card>
    );

    const card = screen.getByTestId("Card");

    expect(card).toContainHTML("<h1>Test1</h1>");
    expect(card).toContainHTML("<p>Test2</p>");
  });
});
