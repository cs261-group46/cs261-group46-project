import React, {FormEventHandler, PropsWithChildren, useDebugValue, useState} from 'react';
import styles from './MultiSelect.module.scss';

type LabelledList<T> = {label: string, value: T}[]

interface MultiSelectProps<T> {
    id: string
    label: string
    default: T
    value: LabelledList<T>
    options: LabelledList<T>
    isValid: boolean
    onChange: ((value: LabelledList<T>) => void)
    onBlur: FormEventHandler<HTMLInputElement>
}

function MultiSelect<T>(
    props: PropsWithChildren<MultiSelectProps<T>>
) {
    let [search, setSearch] = useState("")

    return <div className={styles.MultiSelect}>

        <div className={styles.selectarea}>
            {props.value.map(option => <span className={styles.selection}>
                <p>{option.label}</p>
                <button onClick={() => props.onChange(props.value.filter(x => x.value !== option.value))}>X</button>
            </span>)}
            
            <span role="search" contentEditable>Text</span>
        </div>

        <ol className={styles.autocomplete}>
            {props.options.filter(option => !props.value.map(val => val.value).includes(option.value)).map(option => <span className={styles.selection}>
                <li className={styles.search} onClick={() => props.onChange(props.value.concat(option))}>{option.label}</li>
            </span>)}
        </ol>

        {/*<input value={search} type={"text"} name={props.id} id={props.id} placeholder={""} onChange={event => setSearch((event.target as HTMLInputElement).value)} onBlur={props.onBlur}/>*/}
    </div>
}

export default MultiSelect;
