import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import MentorCard from "./MentorCard";

describe("<MentorCard />", () => {
  test("it should mount", () => {
    render(
      <MentorCard
        mentor={{
          id: 0,
          about: "",
          topics: [],
          user: {
            department: {
              id: 0,
              name: "",
            },
            first_name: "",
            last_name: "",
            email: "",
          },
        }}
      />
    );

    const mentorCard = screen.getByTestId("MentorCard");

    expect(mentorCard).toBeInTheDocument();
  });
});
