import React, {FC, PropsWithChildren} from "react";
import styles from "./Select.module.scss";
import Label from "../Label/Label";
import textInputStyles from "../TextInput/TextInput.module.scss";
import { SelectOptions, SelectOption } from "./Select.d";
interface SelectProps<T> {
  id: string;
  icon?: React.ReactNode;
  label: string;
  placeholder: string;
  options: SelectOptions;
  value: SelectOption<T> | undefined;
  isValid: boolean;
  onChange: (input: SelectOption<T>) => void;
  onBlur: () => void;
}

function Select<T>(props: PropsWithChildren<SelectProps<T>>) {
  console.log(props.options);

  const options = props.options.map(({ id, label }) => (
    <option key={id} value={label}>
      {label}
    </option>
  ));

  const changeHandler: React.ChangeEventHandler<HTMLSelectElement> = (
    event
  ) => {
    // the pair can be reconstructed from id & value properties
    props.onChange(props.options[event.target.selectedIndex]);
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
        defaultValue={0}
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
