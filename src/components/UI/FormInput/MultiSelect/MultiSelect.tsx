import React, {FormEventHandler, PropsWithChildren, useEffect, useState} from 'react';
import styles from './MultiSelect.module.scss';
import Label from "../Label/Label";
import { debounceTime, Subject } from 'rxjs';

type LabelledList<T> = {label: string, value: T}[]

interface MultiSelectProps<T> {
    id: string
    label: string
    default?: T
    value: LabelledList<T>
    isValid: boolean
    onChange: ((value: LabelledList<T>) => void)
    onBlur: FormEventHandler<HTMLInputElement>
    icon?: React.ReactNode
    searchPromise?: ((value: string) => Promise<LabelledList<T>>)
}

function MultiSelect<T>(
    props: PropsWithChildren<MultiSelectProps<T>>
) {
    let [searchResults, setSearchResults] = useState<LabelledList<T>>([])
    let [currentSearch, setCurrentSearch] = useState("");
    let [searchSubject] = useState(new Subject<string>());
    let [focused, setFocused] = useState(false);

    useEffect(() => {
        searchSubject.pipe(
            debounceTime(300)
        ).subscribe(async debounced => {
            if (props.searchPromise) {
                const result = await props.searchPromise(debounced)
                setSearchResults(result)
            }
        });
    }, [props, searchSubject])

    let possibleResults = searchResults.filter(searchResult => !props.value.map(labelled => labelled.value).includes(searchResult.value))

    return <div className={styles.MultiSelect} tabIndex={0} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>

        <Label htmlFor={props.id} icon={props.icon}>{props.label}</Label>

        <div className={`${styles.selectarea} ${focused && styles.focused} ${focused && possibleResults.length > 0 && styles.focusedwithresults}`}>
            {props.value.map((option, index) => 
                <span className={styles.selection} key={index}>
                    <p>{option.label}</p>
                    <button onClick={() => props.onChange(props.value.filter(x => x.value !== option.value))}>X</button>
                </span>)}
            
            {/* <input type="text" className={styles.search} onChange={(event) => searchSubject.next((event.target as HTMLInputElement).value)}/> */}
            <span className={styles.search} role="search" contentEditable onInput={(event) => {
                searchSubject.next((event.target as HTMLSpanElement).innerHTML);
                setCurrentSearch((event.target as HTMLSpanElement).innerHTML);
                }}></span>
            { currentSearch.length === 0 && props.value.length === 0 && <span className={styles.placeholder}>Search...</span> }
        </div>

        { focused && possibleResults.length > 0 &&
            <ol className={styles.autocomplete}>
                {possibleResults.map(option => <span className={styles.selection}>
                    <li className={styles.autocompleteoption} onClick={() => {
                        props.onChange(props.value.concat(option));
                        }}><b>{currentSearch}</b><span>{option.label.substring(currentSearch.length, option.label.length)}</span>
                    </li>
                </span>)}
            </ol>
        }
    </div>
}

// export function DropDown({ options, callback }) {
//     const [selected, setSelected] = useState("");
//     const [expanded, setExpanded] = useState(false);

//     function expand() {
//         setExpanded(true);
//     }

//     function close() {
//         setExpanded(false);
//     }

//     function select(event) {
//         const value = event.target.textContent;
//         callback(value);
//         close();
//         setSelected(value);
//     }

//     return (
//         <div className="dropdown" tabIndex={0} onFocus={expand} onBlur={close} >
//             <div>{selected}</div>
//             {expanded ? (
//                 <div className={"dropdown-options-list"}>
//                     {options.map((O) => (
//                         <div className={"dropdown-option"} onClick={select}>
//                             {O}
//                         </div>
//                     ))}
//                 </div>
//             ) : null}
//         </div>
//     );
// }

export default MultiSelect;
