import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import MentorCard from "./MentorCard";

const mentor = {
  id: 0,
  about: "",
  topics: [],
  user: {
    department: {
      id: 0,
      name: "test0",
    },
    first_name: "test",
    last_name: "test2",
    email: "test3@gmail.com",
  },
};

describe("<MentorCard />", () => {
  test("it should mount", () => {
    render(<MentorCard mentor={mentor} />);

    const mentorCard = screen.getByTestId("MentorCard");

    expect(mentorCard).toBeInTheDocument();
  });

  it("contains the mentors first name", () => {
    render(<MentorCard mentor={mentor} />);

    const mentorCard = screen.getByTestId("MentorCard");

    expect(mentorCard).toHaveTextContent("test1");
  });

  it("contains the mentors last name", () => {
    render(<MentorCard mentor={mentor} />);

    const mentorCard = screen.getByTestId("MentorCard");

    expect(mentorCard).toHaveTextContent("test2");
  });

  it("contains the mentors email", () => {
    render(<MentorCard mentor={mentor} />);

    const mentorCard = screen.getByTestId("MentorCard");

    expect(mentorCard).toHaveTextContent("test3");
  });

  it("contains the mentors department", () => {
    render(<MentorCard mentor={mentor} />);

    const mentorCard = screen.getByTestId("MentorCard");

    expect(mentorCard).toHaveTextContent("test0");
  });
});
