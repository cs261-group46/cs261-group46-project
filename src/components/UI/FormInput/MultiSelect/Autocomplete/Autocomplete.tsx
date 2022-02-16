import React, { FC, PropsWithChildren } from "react";
import styles from "./Autocomplete.module.scss";
import { Options, addSelectedHandler } from "../MultiSelect.d";

interface AutocompleteProps<T> {
  possibleResults: Options<T>;
  currentSearch: string;
  onAddSelected: addSelectedHandler<T>;
}

function Autocomplete<T>(props: PropsWithChildren<AutocompleteProps<T>>) {
  const results = props.possibleResults.map((option, index) => (
    <span key={index}>
      <li
        className={styles.AutoCompleteOption}
        onClickCapture={props.onAddSelected.bind(null, option)}
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

  return <ol className={styles.Autocomplete}>{results}</ol>;
}

export default Autocomplete;
