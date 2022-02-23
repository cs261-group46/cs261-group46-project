import React, { FC } from 'react';
import styles from './DatePicker.module.scss';
import BaseDatePicker from "react-datepicker";
import './datepicker.scss';

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
}

const DatePicker: FC<DatePickerProps> = (props) => (
  <div className={styles.DatePicker} data-testid="DatePicker">
    <BaseDatePicker onChange={props.onChange} selected={props.value}/>
  </div>
);

export default DatePicker;
