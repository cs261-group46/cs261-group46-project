import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import MentorshipRequestCard from "./MentorshipRequestCard";

describe("<MentorshipRequestCard />", () => {
  test("it should mount", () => {
    render(
      <MentorshipRequestCard
        onProcessRequest={function (): void {
          throw new Error("Function not implemented.");
        }}
        mentorshipRequest={{
          id: 0,
          mentee: {
            about: "",
            id: 0,
            topics: [],
            user: {
              id: 0,
              department: {
                id: 0,
                name: "",
              },
              email: "",
              first_name: "",
              last_name: "",
            },
            plans_of_action: [],
            score: 0,
          },
        }}
      />
    );

    const mentorshipRequestCard = screen.getByTestId("ContentCard");

    expect(mentorshipRequestCard).toBeInTheDocument();
  });
});
