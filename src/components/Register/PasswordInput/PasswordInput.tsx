import React, {FC} from 'react';
import styles from './PasswordInput.module.scss';
import TextInput from "../../UI/FormInput/TextInput/TextInput";
import StrengthIndicator from "../StrengthIndicator/StrengthIndicator";

interface PasswordInputProps {
    value: string | undefined
    isValid: boolean
    onChange: (input: string) => void
    onBlur: () => void
}

const PasswordInput: FC<PasswordInputProps> = (props) => {
    return(
        <div data-testid="PasswordInput">
            <TextInput icon="🔒" value={props.value} isValid={props.isValid} onChange={props.onChange} onBlur={props.onBlur} className={styles.AvoidMargin} id="password" type="password" label="Password" placeholder="Please provide your password"/>
            <StrengthIndicator password={props.value}/>
        </div>
    )
        }

export default PasswordInput;
