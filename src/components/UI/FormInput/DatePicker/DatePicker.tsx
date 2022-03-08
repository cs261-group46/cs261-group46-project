import React, { FC, useEffect, useState } from "react";
import styles from "./DatePicker.module.scss";
import BaseDatePicker from "react-datepicker";
import "./datepicker.scss";
import Label from "../Label/Label";
import SystemMessage from "../../SystemMessage/SystemMessage";

interface DatePickerProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  value: Date;
  isValid: boolean;
  onChange: (input: Date) => void;
  onBlur: () => void;
}

const DatePicker: FC<DatePickerProps> = (props) => {
  const [isInvalidMessageVisible, setInvalidMessageVisible] = useState(false);

  useEffect(() => {
    setInvalidMessageVisible(!props.isValid);
  }, [props.isValid]);

  return (
    <div className={styles.DatePicker} data-testid="DatePicker">
      <Label htmlFor={props.id} icon={props.icon}>
        {props.label}
      </Label>
      <BaseDatePicker
        onChange={props.onChange}
        selected={props.value}
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

export default DatePicker;
