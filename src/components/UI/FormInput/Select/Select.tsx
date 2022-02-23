import React, { FC, useEffect, useState } from "react";
import styles from "./Select.module.scss";
import Label from "../Label/Label";
import textInputStyles from "../TextInput/TextInput.module.scss";
import { SelectOptions, SelectOption } from "./Select.d";
import SystemMessage from "../../SystemMessage/SystemMessage";

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
    <option key={id} value={[id.toString(), label ?? ""]}>
      {label}
    </option>
  ));

  const changeHandler: React.ChangeEventHandler<HTMLSelectElement> = (
    event
  ) => {
    // the pair can be reconstructed from id & value properties
    const selected = event.target.value.split(",");
    const newSelectOption: SelectOption = {
      id: parseInt(selected[0]),
      label: selected[1],
    };

    props.onChange(newSelectOption);
  };

  const [isInvalidMessageVisible, setInvalidMessageVisible] = useState(false);
  const closeInvalidMessageHandler = () => {
    setInvalidMessageVisible(false);
  };

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
        defaultValue={(props.value && props.value.id) || -1}
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
        type="warning"
        description={`The ${props.label} field seems to be incorrect`}
        visible={isInvalidMessageVisible}
        onClose={closeInvalidMessageHandler}
      />
    </div>
  );
};

export default Select;
