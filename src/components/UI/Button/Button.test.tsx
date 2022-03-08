import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Button from "./Button";
import fn = jest.fn;
import userEvent from "@testing-library/user-event";

describe("<Button />", () => {
  test("it should mount", () => {
    render(<Button children={""} />);

    const button = screen.getByTestId("Button");

    expect(button).toBeInTheDocument();
  });

  it("should call it callback on click", () => {
    const mockCallback = fn();

    render(<Button onClick={mockCallback}>Test</Button>);

    userEvent.click(screen.getByText("Test"));

    expect(mockCallback).toBeCalled();
  });

  it("should contain a link if given url", () => {
    // to do this, expect a 'no browserrouter' error if try to mount like this
    const callback = () => render(<Button href={"#"}>Test</Button>);

    expect(callback).toThrow();
  });
});
