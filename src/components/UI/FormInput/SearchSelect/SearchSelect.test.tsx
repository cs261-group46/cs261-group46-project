import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import SearchSelect from "./SearchSelect";
import { SearchSelectOptions } from "./SearchSelect";

describe("<SearchSelect />", () => {
  test("it should mount", () => {
    let value: SearchSelectOptions<string> = [{ value: "test", label: "test" }];
    const setValue = (newValue: SearchSelectOptions<string>) => {
      value = newValue;
    };

    render(
      <SearchSelect
        icon="💪"
        id="expertise"
        label="Fields of Expertise"
        value={value}
        isValid={true}
        onChange={setValue}
        onBlur={() => {}}
        searchPromise={(_search) => {
          return new Promise((resolve) =>
            resolve([
              { label: "test1", value: "1" },
              { label: "test2", value: "2" },
            ])
          );
        }}
      />
    );

    const multiSelect = screen.getByTestId("SearchSelect");

    expect(multiSelect).toBeInTheDocument();
  });
});
