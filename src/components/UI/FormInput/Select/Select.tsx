import React, { PropsWithChildren, useEffect, useState } from "react";
import styles from "./Select.module.scss";
import Label from "../Label/Label";
import textInputStyles from "../TextInput/TextInput.module.scss";
import SystemMessage from "../../SystemMessage/SystemMessage";

interface SelectProps<T> {
  id: string;
  icon?: React.ReactNode;
  label: string;
  placeholder: string;
  options: SelectOptions<T>;
  value: SelectOption<T> | undefined;
  isValid: boolean;
  onChange: (input: SelectOption<T>) => void;
  onBlur: () => void;
}

export type SelectOption<T> = { value: T; label?: string };
export type SelectOptions<T> = SelectOption<T>[];

function Select<T>(props: PropsWithChildren<SelectProps<T>>) {
  const options = props.options.map(({ label }, i) => (
    <option key={i} value={label}>
      {label}
    </option>
  ));

  const changeHandler: React.ChangeEventHandler<HTMLSelectElement> = (
    event
  ) => {
    // the pair can be reconstructed from id & value properties
    props.onChange(props.options[event.target.selectedIndex - 1]);
  };

  const [isInvalidMessageVisible, setInvalidMessageVisible] = useState(false);

  useEffect(() => {
    setInvalidMessageVisible(!props.isValid);
  }, [props.isValid]);

  return (
    <div
      className={`${styles.Select} ${textInputStyles.TextInput}`}
      data-testid="Select"
    >
      <Label htmlFor={props.id} icon={props.icon}>
        {props.label}
      </Label>
      <select
        name={props.id}
        id={props.id}
        defaultValue={-1}
        // defaultValue={(props.value && props.value.id) || -1}
        onChange={changeHandler}
        onBlur={props.onBlur}
      >
        <option value={-1} disabled>
          {props.placeholder}
        </option>
        {options}
      </select>

      <SystemMessage
        sort="inline"
        type="alert"
        description={`The ${props.label} field seems to be incorrect`}
        visible={isInvalidMessageVisible}
      />
    </div>
  );
}

export default Select;
