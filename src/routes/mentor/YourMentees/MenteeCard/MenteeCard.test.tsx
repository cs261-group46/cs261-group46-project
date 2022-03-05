import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import MenteeCard from "./MenteeCard";
import { BrowserRouter } from "react-router-dom";

describe("<MenteeCard />", () => {
  test("it should mount", () => {
    render(
      <BrowserRouter>
        <MenteeCard
          mentee={{
            about: "",
            id: 0,
            topics: [],
            user: {
              department: {
                id: 0,
                name: "",
              },
              email: "",
              first_name: "",
              last_name: "",
            },
          }}
        />
      </BrowserRouter>
    );

    const menteecard = screen.getByTestId("ContentCard");

    expect(menteecard).toBeInTheDocument();
  });
});
