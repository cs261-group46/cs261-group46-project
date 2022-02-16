import { useState } from "react";

// function UseInput<T, E>(validateFunction: ((input: T) => boolean)) {
//         enteredValue: string,
//         isValueValid: boolean,
//         isInputValid: boolean,
//         changeHandler: FormEventHandler<HTMLInputElement>,
//         blurHandler: FormEventHandler<HTMLInputElement>,
//         reset: () => void
//     } = (validate: (value: T) => boolean) => {

function UseInput<T>(validate: (value: T) => boolean) {
  const [enteredValue, updateEnteredValue] = useState<T>();
  const [isTouched, updateIsTouched] = useState(false);

  const isValueValid = enteredValue && validate(enteredValue);
  const isInputValid = isValueValid || !isTouched;

  const changeHandler: (newValue: T) => void = (newValue: T) => {
    updateEnteredValue(newValue);
  };

  const blurHandler = () => {
    updateIsTouched(true);
  };

  const reset: () => void = () => {
    updateEnteredValue(undefined);
    updateIsTouched(false);
  };

  return {
    enteredValue,
    isValueValid,
    isInputValid,
    changeHandler,
    blurHandler,
    reset,
  };
}

export default UseInput;
