import React, {FormEventHandler, PropsWithChildren, useDebugValue, useEffect, useState} from 'react';
import styles from './MultiSelect.module.scss';
import Label from "../Label/Label";
import { debounce, debounceTime, fromEvent, Observable, observable, Subject, subscribeOn } from 'rxjs';

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
    icon?: React.ReactNode;
    searchPromise?: ((value: string) => Promise<LabelledList<T>>)
}

function MultiSelect<T>(
    props: PropsWithChildren<MultiSelectProps<T>>
) {
    let [searchResults, setSearchResults] = useState<LabelledList<T>>([])
    let [searchSubject, _] = useState(new Subject<string>());

    useEffect(() => {
        searchSubject.pipe(
            debounceTime(300)
        ).subscribe(async debounced => {
            if (props.searchPromise) {
                const result = await props.searchPromise(debounced)
                setSearchResults(result)
            }
        });
    }, [])

    return <div className={styles.MultiSelect}>

        <Label htmlFor={props.id} icon={props.icon}>{props.label}</Label>

        <div className={styles.selectarea}>
            {props.value.map((option, index) => 
                <span className={styles.selection} key={index}>
                    <p>{option.label}</p>
                    <button onClick={() => props.onChange(props.value.filter(x => x.value !== option.value))}>X</button>
                </span>)}
            
            {/* <input type="text" className={styles.search} onChange={(event) => searchSubject.next((event.target as HTMLInputElement).value)}/> */}
            <span className={styles.search} role="search" contentEditable onInput={(event) => searchSubject.next((event.target as HTMLSpanElement).innerHTML)}>Search...</span>
        </div>

        <ol className={styles.autocomplete}>
            {props.options
            .filter(option => !props.value.map(val => val.value).includes(option.value))
            .filter(option => searchResults.length == 0 && !searchResults.map(val => val.value).includes(option.value))
            .map(option => <span className={styles.selection}>
                <li className={styles.search} onClick={() => props.onChange(props.value.concat(option))}>{option.label}</li>
            </span>)}
        </ol>
    </div>
}

export default MultiSelect;
