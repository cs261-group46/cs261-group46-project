import React, { PropsWithChildren } from "react";
import styles from "./Autocomplete.module.scss";
import { MultiSelectOptions, AddSelectedHandler } from "../MultiSelect.d";

interface AutocompleteProps<T> {
  possibleResults: MultiSelectOptions<T>;
  currentSearch: string;
  onAddSelected: AddSelectedHandler<T>;
}

function Autocomplete<T>(props: PropsWithChildren<AutocompleteProps<T>>) {
  const results = props.possibleResults.map((option, index) => (
    <span key={index}>
      <li
        className={styles.AutoCompleteOption}
        onClick={props.onAddSelected.bind(null, option)}
      >
        <b>{props.currentSearch}</b>
        <span>
          {option.label.substring(
            props.currentSearch.length,
            option.label.length
          )}
        </span>
      </li>
    </span>
  ));

  return <ol className={styles.Autocomplete} data-testid="Autocomplete">{results}</ol>;
}

export default Autocomplete;
