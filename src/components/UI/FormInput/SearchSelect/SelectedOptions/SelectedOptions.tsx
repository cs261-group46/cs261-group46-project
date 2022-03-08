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
      <input
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          props.onRemoveSelected.bind(null, option.value);
        }}
      >
        X
      </input>
    </span>
  ));

  return <div data-testid="SelectedOptions">{selected}</div>;
}

export default SelectedOptions;
