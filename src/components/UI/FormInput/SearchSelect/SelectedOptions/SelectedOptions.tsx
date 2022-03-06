import React, { PropsWithChildren } from "react";
import styles from "./SelectedOptions.module.scss";
import { SearchSelectOptions, RemoveSelectedHandler } from "../SearchSelect";

interface SelectedOptionsProps<T> {
  selected: SearchSelectOptions<T>;
  onRemoveSelected: RemoveSelectedHandler<T>;
}

function SelectedOptions<T>(props: PropsWithChildren<SelectedOptionsProps<T>>) {
  const selected = props.selected.map((option, index) => (
    <span className={styles.SelectedOption} key={index}>
      <p>{option.label}</p>
      <button onClick={props.onRemoveSelected.bind(null, option.value)}>
        X
      </button>
    </span>
  ));

  return <div data-testid="SelectedOptions">{selected}</div>;
}

export default SelectedOptions;
