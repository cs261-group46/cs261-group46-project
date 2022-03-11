import { useCallback, useState } from "react";

// function UseInput<T, E>(validateFunction: ((input: T) => boolean)) {
//         enteredValue: string,
//         isValueValid: boolean,
//         isInputValid: boolean,
//         changeHandler: FormEventHandler<HTMLInputElement>,
//         blurHandler: FormEventHandler<HTMLInputElement>,
//         reset: () => void
//     } = (validate: (value: T) => boolean) => {

function useInput<T>(
  initialValue: T,
  validationFunction: (value: T) => boolean = (_) => true
) {
  const [enteredValue, updateEnteredValue] = useState<T>(initialValue);
  const [isTouched, updateIsTouched] = useState(false);

  const isValueValid = validationFunction(enteredValue);
  const isInputValid = isValueValid || !isTouched;

  const changeHandler: (newValue: T) => void = useCallback((newValue: T) => {
    updateEnteredValue(newValue);
  }, []);

  const blurHandler = () => {
    updateIsTouched(true);
  };

  const reset: () => void = () => {
    updateEnteredValue(initialValue);
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

export default useInput;
