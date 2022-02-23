import React, { FC } from 'react';
import styles from './DatePicker.module.scss';
import BaseDatePicker from "react-datepicker";
import './datepicker.scss';
import Label from "../Label/Label";

interface DatePickerProps {
    id: string;
    label: string;
    icon?: React.ReactNode;
    value: Date;
    isValid: boolean;
    onChange: (input: Date) => void;
    onBlur: () => void;
}

const DatePicker: FC<DatePickerProps> = (props) => (
    <div className={styles.DatePicker} data-testid="DatePicker">
        <Label htmlFor={props.id} icon={props.icon}>{props.label}</Label>
        <BaseDatePicker onChange={props.onChange} selected={props.value} onBlur={props.onBlur}/>
    </div>
);

export default DatePicker;
