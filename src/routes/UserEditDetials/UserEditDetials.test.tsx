import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import UserEditDetials from "./UserEditDetials";
import { BrowserRouter } from "react-router-dom";

describe("<UserEditDetials />", () => {
  test("it should mount", () => {
    render(
      <BrowserRouter>
        <UserEditDetials />
      </BrowserRouter>
    );

    const userEditDetials = screen.getByTestId("UserEditDetials");

    expect(userEditDetials).toBeInTheDocument();
  });
});
