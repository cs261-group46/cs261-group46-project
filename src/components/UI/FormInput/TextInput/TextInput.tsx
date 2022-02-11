import React, {FC, FormEventHandler, useEffect, useState} from 'react';
import styles from './TextInput.module.scss';
import Twemoji from "react-twemoji";
import Label from "../Label/Label";

interface TextInputProps {
    id: string
    label: string
    placeholder: string
    icon?: React.ReactNode
    onInput?: (enteredPassword: string) => void
    type?: string
    className?: any
}

const TextInput: FC<TextInputProps> = (props) => {
    const [enteredText, changeEnteredText] = useState("")

    const inputHandler : FormEventHandler<HTMLInputElement> = (event) => {
        // changeInput
        const target = event.target as HTMLInputElement
        if (target) {
            changeEnteredText(target.value)
        }
    }

    const { onInput } = props
    useEffect(()=>{
        if (onInput) {
            onInput(enteredText)
        }
    }, [onInput, enteredText])

    return (
        <div className={`${styles.TextInput} ${props.className}`} data-testid="TextInput">
            {/*<div className={styles.Label}>*/}
            {/*    {props.icon && <Twemoji noWrapper={true} options={{className: styles.Emoji}}>*/}
            {/*        <div className={styles.Icon}>*/}
            {/*            {props.icon}*/}
            {/*        </div>*/}
            {/*    </Twemoji>}*/}

            {/*    <label htmlFor={props.id}>{props.label}</label>*/}
            {/*</div>*/}
            <Label htmlFor={props.id} icon={props.icon}>{props.label}</Label>
            <input value={enteredText} type={props.type ?? "text"} name={props.id} id={props.id} placeholder={props.placeholder} onInput={inputHandler}/>
        </div>
    )
};

export default TextInput;
