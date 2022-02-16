import React, {ChangeEventHandler, FC} from "react";
import styles from "./TextInput.module.scss";
import Label from "../Label/Label";

interface TextInputProps {
  id: string;
  label: string;
  placeholder: string;
  icon?: React.ReactNode;
  type?: string;
  className?: any;
  value: string | undefined;
  isValid: boolean;
  onChange: (input: string) => void;
  onBlur: () => void;
}

const TextInput: FC<TextInputProps> = (props) => {
  const changeHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
    const target = event.target;
    if (target) {
      props.onChange(target.value);
    }
  };

  return (
    <div
      className={`${styles.TextInput} ${props.className}`}
      data-testid="TextInput"
    >
      <Label htmlFor={props.id} icon={props.icon}>
        {props.label}
      </Label>
      <input
        value={props.value}
        type={props.type ?? "text"}
        name={props.id}
        id={props.id}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={props.onBlur}
      />
    </div>
  );
};

export default TextInput;
