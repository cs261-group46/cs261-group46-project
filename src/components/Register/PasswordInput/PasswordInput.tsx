import React, {FC, FormEventHandler, useCallback, useState} from 'react';
import styles from './PasswordInput.module.scss';
import TextInput from "../../UI/FormInput/TextInput/TextInput";
import StrengthIndicator from "../StrengthIndicator/StrengthIndicator";

interface PasswordInputProps {
    value: string
    isValid: boolean
    onChange: FormEventHandler<HTMLInputElement>
    onBlur: FormEventHandler<HTMLInputElement>
}

const PasswordInput: FC<PasswordInputProps> = (props) => {
    return(
        <>
            <TextInput icon="🔒" value={props.value} isValid={props.isValid} onChange={props.onChange} onBlur={props.onBlur} className={styles.AvoidMargin} id="password" type="password" label="Password" placeholder="Please provide your password"/>
            <StrengthIndicator password={props.value}/>
        </>
    )
        }

export default PasswordInput;
