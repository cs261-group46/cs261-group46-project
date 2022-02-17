import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import PasswordInput from "./PasswordInput";

describe("<PasswordInput />", () => {
  test("it should mount", () => {
    let value = "password"
    let valid = true

    render(
      <PasswordInput
        value={value}
        isValid={valid}
        onBlur={() => {}}
        onChange={newValue => {
          value = newValue
          valid = newValue.length > 6
        }}
      />
    );

    const passwordInput = screen.getByTestId("PasswordInput");

    expect(passwordInput).toBeInTheDocument();
  });
});
