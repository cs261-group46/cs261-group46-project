import React, { ChangeEventHandler, FC, useEffect, useState } from "react";
import styles from "./TextInput.module.scss";
import Label from "../Label/Label";
import SystemMessage from "../../SystemMessage/SystemMessage";

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

  const [isInvalidMessageVisible, setInvalidMessageVisible] = useState(false);

  useEffect(() => {
    setInvalidMessageVisible(!props.isValid);
  }, [props.isValid]);

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

      <SystemMessage
        sort="inline"
        type="alert"
        description={`The ${props.label} field seems to be incorrect`}
        visible={isInvalidMessageVisible}
      />
    </div>
  );
};

export default TextInput;
