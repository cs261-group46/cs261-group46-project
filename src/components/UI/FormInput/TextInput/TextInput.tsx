import React, {FC, FormEventHandler, useEffect, useState} from 'react';
import styles from './TextInput.module.scss';
import Twemoji from "react-twemoji";
import Label from "../Label/Label";

interface TextInputProps {
    id: string
    label: string
    placeholder: string
    icon?: React.ReactNode
    type?: string
    className?: any
    value: string
    isValid: boolean
    onChange: FormEventHandler<HTMLInputElement>
    onBlur: FormEventHandler<HTMLInputElement>
}

const TextInput: FC<TextInputProps> = (props) => {
    return (
        <div className={`${styles.TextInput} ${props.className}`} data-testid="TextInput">
            <Label htmlFor={props.id} icon={props.icon}>{props.label}</Label>
            <input value={props.value} type={props.type ?? "text"} name={props.id} id={props.id} placeholder={props.placeholder} onChange={props.onChange} onBlur={props.onBlur}/>

        </div>
    )
};

export default TextInput;
