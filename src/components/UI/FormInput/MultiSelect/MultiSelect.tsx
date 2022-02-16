import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import styles from "./MultiSelect.module.scss";
import Label from "../Label/Label";
import { debounceTime, Subject } from "rxjs";
import {
  Options,
  addSelectedHandler,
  removeSelectedHandler,
  searchPromise,
} from "./MultiSelect.d";
import SelectedOptions from "./SelectedOptions/SelectedOptions";
import Autocomplete from "./Autocomplete/Autocomplete";

interface MultiSelectProps<T> {
  id: string;
  label: string;
  default?: T;
  selected: Options<T>;
  isValid: boolean;
  onRemoveSelected: removeSelectedHandler<T>;
  onAddSelected: addSelectedHandler<T>;
  icon?: React.ReactNode;
  searchPromise?: searchPromise;
}

function MultiSelect<T>(props: PropsWithChildren<MultiSelectProps<T>>) {
  const [searchResults, setSearchResults] = useState<Options<T>>([]);
  const [currentSearch, setCurrentSearch] = useState("");
  const [searchSubject] = useState(new Subject<string>());
  const [focused, setFocused] = useState(false);

  const inputElement = useRef<HTMLSpanElement>(null);

  const { searchPromise } = props;

  useEffect(() => {
    searchSubject.pipe(debounceTime(300)).subscribe(async (debounced) => {
      if (searchPromise) {
        const result = await searchPromise(debounced);
        setSearchResults(result);
      }
    });
  }, [searchPromise, searchSubject]);

  const possibleResults = searchResults.filter(
    (searchResult) =>
      !props.selected
        .map((labelled) => labelled.value)
        .includes(searchResult.value)
  );

  const addSelectedHandler: addSelectedHandler<T> = (selected) => {
    props.onAddSelected(selected);
    setCurrentSearch("");
    setSearchResults([]);
    const inputEl: HTMLSpanElement | null = inputElement.current;
    if (inputEl) inputEl.innerText = "";
  };

  const inputHandler = () => {
    const inputEl: HTMLSpanElement | null = inputElement.current;
    if (inputEl) {
      searchSubject.next(inputEl.innerText);
      setCurrentSearch(inputEl.innerText);
      setSearchResults([]);
    }
  };

  const blurHandler = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setFocused(false);
    }
  };

  const focusHandler = (event) => {
    if (
      event.currentTarget === event.target ||
      !event.currentTarget.contains(event.relatedTarget)
    ) {
      const inputEl: HTMLSpanElement | null = inputElement.current;
      if (inputEl) {
        console.log(inputEl);
        inputEl.focus();
      }
      setFocused(true);
    }
  };

  return (
    <div
      className={styles.MultiSelect}
      tabIndex={0}
      onFocus={focusHandler}
      onBlur={blurHandler}
    >
      <Label htmlFor={props.id} icon={props.icon}>
        {props.label}
      </Label>

      <div
        className={`${styles.selectArea} ${focused && styles.focused} ${
          focused && possibleResults.length > 0 && styles.focusedWithResults
        }`}
      >
        <SelectedOptions
          selected={props.selected}
          onRemoveSelected={props.onRemoveSelected}
        />

        <span
          className={styles.search}
          role="search"
          ref={inputElement}
          contentEditable
          onInput={inputHandler}
        ></span>
        {currentSearch.length === 0 && props.selected.length === 0 && (
          <span className={styles.placeholder}>Search...</span>
        )}
      </div>
      {focused && possibleResults.length > 0 && (
        <Autocomplete
          possibleResults={possibleResults}
          currentSearch={currentSearch}
          onAddSelected={addSelectedHandler}
        />
      )}
    </div>
  );
}

export default MultiSelect;
