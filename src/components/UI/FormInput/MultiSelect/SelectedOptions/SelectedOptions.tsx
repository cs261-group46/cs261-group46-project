import React, { PropsWithChildren } from "react";
import styles from "./SelectedOptions.module.scss";
import { Options, removeSelectedHandler } from "../MultiSelect.d";

interface SelectedOptionsProps<T> {
  selected: Options<T>;
  onRemoveSelected: removeSelectedHandler<T>;
}

// function MultiSelect<T>(
//     props: PropsWithChildren<MultiSelectProps<T>>
// ) {

function SelectedOptions<T>(props: PropsWithChildren<SelectedOptionsProps<T>>) {
  const selected = props.selected.map((option, index) => (
    <span className={styles.SelectedOption} key={index}>
      <p>{option.label}</p>
      <button onClick={props.onRemoveSelected.bind(null, option.value)}>
        X
      </button>
    </span>
  ));

  return <>{selected}</>;
}

export default SelectedOptions;
