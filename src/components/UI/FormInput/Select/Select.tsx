import React, { FC } from "react";
import styles from "./Select.module.scss";
import Label from "../Label/Label";
import textInputStyles from "../TextInput/TextInput.module.scss";
import { SelectOptions, SelectOption } from "./Select.d";
interface SelectProps {
  id: string;
  icon?: React.ReactNode;
  label: string;
  placeholder: string;
  options: SelectOptions;
  value: SelectOption | undefined;
  isValid: boolean;
  onChange: (input: SelectOption) => void;
  onBlur: () => void;
}

const Select: FC<SelectProps> = (props) => {
  const options = props.options.map(({ id, label }) => (
    <option key={id} value={label}>
      {label}
    </option>
  ));

  const changeHandler = (event) => {
    props.onChange(event.target.value);
  };
  
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
        defaultValue={(props.value && props.value.id) || 0}
        onChange={changeHandler}
        onBlur={props.onBlur}
      >
        <option value={0} disabled>
          {props.placeholder}
        </option>
        {options}
      </select>
    </div>
  );
};

export default Select;
