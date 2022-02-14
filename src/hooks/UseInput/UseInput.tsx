import {FormEventHandler, useState} from 'react';

const UseInput:
    (validateFunction: ((input: string) => boolean))
        => {
        enteredValue: string,
        isValueValid: boolean,
        isInputValid: boolean,
        changeHandler: FormEventHandler<HTMLInputElement>,
        blurHandler: FormEventHandler<HTMLInputElement>,
        reset: () => void
    } = (validate: (value: string) => boolean) => {

    const [enteredValue, updateEnteredValue] = useState("");
    const [isTouched, updateIsTouched] = useState(false);

    const isValueValid = validate(enteredValue);
    const isInputValid = isValueValid || !isTouched;

    const changeHandler : FormEventHandler<HTMLInputElement> = (event) => {
        const target = event.target as HTMLInputElement
        if (target) {
            updateEnteredValue(target.value);
        }
    };

    const blurHandler : FormEventHandler<HTMLInputElement> = () => {
        updateIsTouched(true);
    };

    const reset : () => void = () => {
        updateEnteredValue("");
        updateIsTouched(false);
    };

    return {
        enteredValue,
        isValueValid,
        isInputValid,
        changeHandler,
        blurHandler,
        reset
    };
};

export default UseInput;
