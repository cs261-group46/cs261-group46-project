import React, {FormEventHandler, PropsWithChildren} from 'react';
import styles from './MultiSelect.module.scss';
import TextInput from "../TextInput/TextInput";

interface MultiSelectProps<T> {
    id: string
    label: string
    default: T
    value: T
    options: T[]
    isValid: boolean
    onChange: FormEventHandler<HTMLInputElement>
    onBlur: FormEventHandler<HTMLInputElement>
}

function MultiSelect<T>(
    props: PropsWithChildren<MultiSelectProps<T>>
) {
    return <div className={styles.MultiSelect}>
        <TextInput id={props.id} label={props.label} placeholder={""}/>
    </div>
}

export default MultiSelect;
