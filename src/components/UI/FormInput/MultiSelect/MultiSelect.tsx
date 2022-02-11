import React, {FormEventHandler, PropsWithChildren, useState} from 'react';
import styles from './MultiSelect.module.scss';

interface MultiSelectProps<T> {
    id: string
    label: string
    default: T
    value: T[]
    options: T[]
    isValid: boolean
    onChange: FormEventHandler<HTMLInputElement>
    onBlur: FormEventHandler<HTMLInputElement>
}

function MultiSelect<T>(
    props: PropsWithChildren<MultiSelectProps<T>>
) {
    let [search, setSearch] = useState("")

    return <div className={styles.MultiSelect}>

        <span role="search" contentEditable>Text</span>

        {/*<input value={search} type={"text"} name={props.id} id={props.id} placeholder={""} onChange={event => setSearch((event.target as HTMLInputElement).value)} onBlur={props.onBlur}/>*/}
    </div>
}

export default MultiSelect;
