import React, {FC, useCallback, useState} from 'react';
// import styles from './PasswordInput.module.scss';
import TextInput from "../../UI/FormInput/TextInput/TextInput";
import StrengthIndicator from "../StrengthIndicator/StrengthIndicator";
import styles from "./PasswordInput.module.scss"

interface PasswordInputProps {}

const PasswordInput: FC<PasswordInputProps> = () => {
    const [enteredPassword, changeEnteredPassword] = useState("")

    const inputHandler = useCallback((enteredPassword : string) => {
        changeEnteredPassword(enteredPassword)
    }, [])

    return(
        <>
            <TextInput icon="🔒" className={styles.AvoidMargin} id="password" type="password" label="Password" placeholder="Please provide your password" onInput={inputHandler}/>
            <StrengthIndicator password={enteredPassword}/>
        </>
    )
        }

export default PasswordInput;
