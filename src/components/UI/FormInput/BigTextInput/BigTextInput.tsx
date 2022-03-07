import React, { ChangeEventHandler, FC, useEffect, useState } from "react";
import styles from "./BigTextInput.module.scss";
import Label from "../Label/Label";
import SystemMessage from "../../SystemMessage/SystemMessage";

interface BigTextInputProps {
  id: string;
  label: string;
  placeholder: string;
  icon?: React.ReactNode;
  className?: any;
  value: string | undefined;
  isValid: boolean;
  onChange: (input: string) => void;
  onBlur: () => void;
}

const BigTextInput: FC<BigTextInputProps> = (props) => {
  const changeHandler: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
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
    <div className={styles.BigTextInput} data-testid="BigTextInput">
      <Label htmlFor={props.id} icon={props.icon}>
        {props.label}
      </Label>
      <textarea
        value={props.value}
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

export default BigTextInput;
