import React, {
  FocusEventHandler,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from './SearchSelect.module.scss';
import Label from '../Label/Label';
import { debounceTime, Subject } from 'rxjs';
import {
  AddSelectedHandler,
  MultiSelectOptions,
  RemoveSelectedHandler,
  SearchPromise,
} from './SearchSelect.d';

import SelectedOptions from './SelectedOptions/SelectedOptions';
import Autocomplete from './Autocomplete/Autocomplete';

interface MultiSelectProps<T> {
  id: string;
  label: string;
  default?: T;
  isValid: boolean;
  icon?: React.ReactNode;
  searchPromise?: SearchPromise<T>;
  value: MultiSelectOptions<T>;
  limit?: number;
  onChange: (input: MultiSelectOptions<T>) => void;
  onBlur: () => void;
}

function SearchSelect<T>(props: PropsWithChildren<MultiSelectProps<T>>) {
  const [searchResults, setSearchResults] = useState<MultiSelectOptions<T>>([]);
  const [currentSearch, setCurrentSearch] = useState('');
  const [focused, setFocused] = useState(false);
  const searchSubject = useMemo(() => new Subject<string>(), []);
  const limit = props.limit || -1;

  const inputElement = useRef<HTMLSpanElement>(null);

  const { searchPromise } = props;

  const removeExpertiseHandler: RemoveSelectedHandler<T> = selected => {
    const newExpertises = props.value.filter(x => x.value !== selected);
    props.onChange(newExpertises);
  };

  const addSelectedHandler: AddSelectedHandler<T> = selected => {
    const newExpertises = props.value.concat(selected);
    props.onChange(newExpertises);
    setCurrentSearch('');
    setSearchResults([]);
    const inputEl: HTMLSpanElement | null = inputElement.current;
    if (inputEl) inputEl.innerText = '';
  };

  useEffect(() => {
    searchSubject.pipe(debounceTime(300)).subscribe(async debounced => {
      if (searchPromise) {
        const result = await searchPromise(debounced);
        setSearchResults(result);
      }
    });
  }, [searchPromise, searchSubject]);

  const possibleResults = searchResults.filter(
    searchResult =>
      !props.value.map(labelled => labelled.value).includes(searchResult.value)
  );

  const inputHandler = () => {
    const inputEl: HTMLSpanElement | null = inputElement.current;
    if (inputEl) {
      searchSubject.next(inputEl.innerText);
      setCurrentSearch(inputEl.innerText);
      setSearchResults([]);
    }
  };

  const blurHandler: FocusEventHandler<HTMLDivElement> = event => {
    props.onBlur();
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setFocused(false);
    }
  };

  const focusHandler: FocusEventHandler<HTMLDivElement> = event => {
    if (
      event.currentTarget === event.target ||
      !event.currentTarget.contains(event.relatedTarget)
    ) {
      const inputEl: HTMLSpanElement | null = inputElement.current;
      if (inputEl) {
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
      data-testid='SearchSelect'
    >
      <Label htmlFor={props.id} icon={props.icon}>
        {props.label}
      </Label>

      <div
        className={`${styles.selectArea} ${focused && styles.focused} ${
          focused &&
          possibleResults.length > 0 &&
          props.value.length < limit &&
          styles.focusedWithResults
        }`}
      >
        <SelectedOptions
          selected={props.value}
          onRemoveSelected={removeExpertiseHandler}
        />

        <span
          className={styles.search}
          role='search'
          ref={inputElement}
          contentEditable
          onInput={inputHandler}
        ></span>
        {currentSearch.length === 0 && props.value.length === 0 && (
          <span className={styles.placeholder}>Search...</span>
        )}
      </div>
      {focused && possibleResults.length > 0 && props.value.length < limit && (
        <Autocomplete
          possibleResults={possibleResults}
          currentSearch={currentSearch}
          onAddSelected={addSelectedHandler}
        />
      )}
    </div>
  );
}

export default SearchSelect;
