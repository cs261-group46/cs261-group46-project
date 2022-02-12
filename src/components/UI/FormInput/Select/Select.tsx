import React, { FC } from 'react';
import styles from './Select.module.scss';
import Label from "../Label/Label";
import textInputStyles from '../TextInput/TextInput.module.scss'

interface SelectProps {
    id: string;
    icon?: React.ReactNode;
    label: string;
    placeholder: string;
    options: {option_id: string, option: string}[];
}

const Select: FC<SelectProps> = (props) => {
    const options = props.options.map(({option_id, option}) => <option key={option_id} value={option_id}>{option}</option>)
    return (
        <div className={`${styles.Select} ${textInputStyles.TextInput}`} data-testid="Select">
            <Label htmlFor={props.id} icon={props.icon}>{props.label}</Label>
            <select name={props.id} id={props.id} defaultValue={0}>
                <option value={0} disabled>{props.placeholder}</option>
                {options}
            </select>
        </div>
        )
};

export default Select;
