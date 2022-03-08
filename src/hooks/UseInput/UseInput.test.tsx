import React from "react";
import UseInput from "./UseInput";
import { render, screen } from "@testing-library/react";

function UseInputHookTester(props: {
  validator: (check: number) => boolean;
  initial?: number;
  yieldHook: (hook: {
    enteredValue: number;
    isValueValid: boolean;
    isInputValid: boolean;
    changeHandler: (newValue: number) => void;
    blurHandler: () => void;
    reset: () => void;
  }) => void;
}) {
  const hook = UseInput<number>(props.initial ?? 1, props.validator);

  props.yieldHook(hook);

  return <p data-testid="UseInputHookTester">{hook.enteredValue}</p>;
}

describe("UseLogin", () => {
  it("should be able to be used in a component", () => {
    render(<UseInputHookTester yieldHook={() => {}} validator={() => true} />);

    const tester = screen.getByTestId("UseInputHookTester");

    expect(tester).toBeInTheDocument();
  });

  it("should have valud valid be true for initially true value", () => {
    var isValueValid = false;

    render(
      <UseInputHookTester
        yieldHook={(hook) => {
          isValueValid = hook.isValueValid;
        }}
        validator={() => true}
      />
    );

    expect(isValueValid).toBeTruthy();
  });

  it("should have valud valid be false for initially false value", () => {
    var isValueValid = false;

    render(
      <UseInputHookTester
        yieldHook={(hook) => {
          isValueValid = hook.isValueValid;
        }}
        validator={() => false}
      />
    );

    expect(isValueValid).toBeFalsy();
  });

  it("should start off with the initially given value", () => {
    var value = 0;
    var expected = Math.floor(Math.random() * 10); // use a random number to be extra stringent

    render(
      <UseInputHookTester
        yieldHook={(hook) => {
          value = hook.enteredValue;
        }}
        validator={() => true}
        initial={expected}
      />
    );

    expect(value).toEqual(expected);
  });

  it("should change the value when using onChangeHandler", () => {
    var expected = Math.floor(Math.random() * 10);
    var rerender = true;

    render(
      <UseInputHookTester
        yieldHook={(hook) => {
          if (rerender) {
            hook.changeHandler(expected);
            rerender = false;
          }
        }}
        validator={() => true}
        initial={0}
      />
    );

    const tester = screen.getByTestId("UseInputHookTester");

    expect(tester).toHaveTextContent(expected.toString());
  });

  it("should have valid value start off as true", () => {
    var inputValid = false;

    render(
      <UseInputHookTester
        yieldHook={(hook) => {
          inputValid = hook.isInputValid;
        }}
        validator={() => false}
        initial={1}
      />
    );

    expect(inputValid).toBeTruthy();
  });

  it("should ensure value valid set to false if needed when blurred", () => {
    var rerenders = 0;
    var inputValid = false;

    render(
      <UseInputHookTester
        yieldHook={(hook) => {
          if (rerenders < 2) {
            hook.blurHandler();
            inputValid = hook.isInputValid;
            rerenders++;
          }
        }}
        validator={() => false}
        initial={1}
      />
    );

    expect(inputValid).toBeFalsy();
  });

  it("should ensure true valid remains true after blur", () => {
    var rerenders = 0;
    var inputValid = false;

    render(
      <UseInputHookTester
        yieldHook={(hook) => {
          if (rerenders < 2) {
            hook.blurHandler();
            inputValid = hook.isInputValid;
            rerenders++;
          }
        }}
        validator={() => true}
        initial={1}
      />
    );

    expect(inputValid).toBeTruthy();
  });
});
