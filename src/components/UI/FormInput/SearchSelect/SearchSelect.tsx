import React, {
  FocusEventHandler,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./SearchSelect.module.scss";
import Label from "../Label/Label";
import { debounceTime, Subject } from "rxjs";
import SelectedOptions from "./SelectedOptions/SelectedOptions";
import Autocomplete from "./Autocomplete/Autocomplete";
import SystemMessage from "../../SystemMessage/SystemMessage";
import DraggableSelectedOptions from "./DraggableSelectedOptions/DraggableSelectedOptions";

export type SearchSelectOption<T> = { label: string; value: T };
export type SearchSelectOptions<T> = SearchSelectOption<T>[];
export type RemoveSelectedHandler<T> = (selected: T) => void;
export type AddSelectedHandler<T> = (selected: SearchSelectOption<T>) => void;
export type SetSelectedHandler<T> = (selected: SearchSelectOptions<T>) => void;
export type SearchPromise<T> = (
  value: string
) => Promise<SearchSelectOptions<T>>;

type OptionsType = "span" | "draggable";

interface SearchSelectProps<T> {
  id: string;
  label: string;
  default?: T;
  isValid: boolean;
  icon?: React.ReactNode;
  searchPromise?: SearchPromise<T>;
  value: SearchSelectOptions<T>;
  limit?: number;
  onChange: (input: SearchSelectOptions<T>) => void;
  onBlur: () => void;
  type?: OptionsType;
  className?: string;
}

function SearchSelect<T>(props: PropsWithChildren<SearchSelectProps<T>>) {
  const [searchResults, setSearchResults] = useState<SearchSelectOptions<T>>(
    []
  );
  const [currentSearch, setCurrentSearch] = useState("");
  const [focused, setFocused] = useState(false);
  const searchSubject = useMemo(() => new Subject<string>(), []);
  const limit = props.limit || 5;

  const inputElement = useRef<HTMLSpanElement>(null);

  const { searchPromise } = props;
  const type = props.type ?? "span";

  const removeSelectedHandler: RemoveSelectedHandler<T> = (selected) => {
    const newExpertises = props.value.filter((x) => x.value !== selected);
    props.onChange(newExpertises);
  };

  const addSelectedHandler: AddSelectedHandler<T> = (selected) => {
    const newExpertises = props.value.concat(selected);
    props.onChange(newExpertises);
    setCurrentSearch("");
    setSearchResults([]);
    const inputEl: HTMLSpanElement | null = inputElement.current;
    if (inputEl) inputEl.innerText = "";
  };

  useEffect(() => {
    searchSubject.pipe(debounceTime(200)).subscribe(async (debounced) => {
      if (searchPromise) {
        const result = await searchPromise(debounced);
        setSearchResults(result);
      }
    });
  }, [searchPromise, searchSubject]);

  const possibleResults = searchResults
    ? searchResults.filter(
        (searchResult) =>
          !props.value
            .map((labelled) => labelled.value)
            .includes(searchResult.value)
      )
    : [];

  const inputHandler = () => {
    const inputEl: HTMLSpanElement | null = inputElement.current;
    if (inputEl) {
      searchSubject.next(inputEl.innerText);
      setCurrentSearch(inputEl.innerText);
      setSearchResults([]);
    }
  };

  const blurHandler: FocusEventHandler<HTMLDivElement> = (event) => {
    props.onBlur();
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setFocused(false);
    }
  };

  const focusHandler: FocusEventHandler<HTMLDivElement> = (event) => {
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

  const [isInvalidMessageVisible, setInvalidMessageVisible] = useState(false);

  useEffect(() => {
    setInvalidMessageVisible(!props.isValid);
  }, [props.isValid]);

  return (
    <div
      className={`${styles.MultiSelect} ${props.className ?? ""}`}
      tabIndex={0}
      onFocus={focusHandler}
      onBlur={blurHandler}
      data-testid="SearchSelect"
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
        {type === "span" && (
          <SelectedOptions
            selected={props.value}
            onRemoveSelected={removeSelectedHandler}
          />
        )}

        <span
          className={styles.search}
          role="search"
          ref={inputElement}
          onKeyPress={(event) =>
            event.key === "Enter" && event.preventDefault()
          }
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
      {type === "draggable" && (
        <DraggableSelectedOptions
          selected={props.value}
          onRemoveSelected={removeSelectedHandler}
          onSetSelected={props.onChange}
        />
      )}
      <SystemMessage
        sort="inline"
        type="alert"
        description={`The ${props.label} field seems to be incorrect`}
        visible={isInvalidMessageVisible}
      />
    </div>
  );
}

export default SearchSelect;
