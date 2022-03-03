import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import MentorIndex from "./MentorIndex";

describe("<MentorIndex />", () => {
  test("it should mount", () => {
    render(<MentorIndex />);

    const mentorIndex = screen.getByTestId("MentorIndex");

    expect(mentorIndex).toBeInTheDocument();
  });
});
