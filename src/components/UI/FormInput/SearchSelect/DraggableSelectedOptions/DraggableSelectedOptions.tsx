import React, {PropsWithChildren, useRef, useState} from "react";
import styles from "./DraggableSelectedOptions.module.scss";
import {MultiSelectOptions, MultiSelectOption, RemoveSelectedHandler, SetSelectedHandler} from "../SearchSelect.d";
import Draggable  from "react-draggable";

interface SelectedOptionsProps<T> {
  selected: MultiSelectOptions<T>;
  onRemoveSelected: RemoveSelectedHandler<T>;
  onSetSelected: SetSelectedHandler<T>;
}

function DraggableSelectedOptions<T>(props: PropsWithChildren<SelectedOptionsProps<T>>) {
  const [currentDragged, setCurrentDragged] = useState<number>();
  const ref = useRef(null);
  const refs = useRef<HTMLDivElement[]>([]);

  const selection = props.selected.map((option, index) =>
        <Draggable
            axis={"y"}
            key={index}
            handle={".handle"}
            nodeRef={ref}
            onStart={() => setCurrentDragged(index)}
            onStop={() => {
              setCurrentDragged(-1);
              reorderList();
            }}
        >
          <div ref={el => {if (el) refs.current[index] = el}} className={`${styles.DraggableOption} handle`} style={{zIndex: currentDragged === index ? 1: "initial"}}>
            <p>{option.label}</p>
            <button onClick={props.onRemoveSelected.bind(null, option.value)}>X</button>
          </div>
        </Draggable>
    )

  function reorderList() {
    const sorted = props.selected.map<[number, MultiSelectOption<T>]>((option, index) => {
      const div = refs.current[index];

      return [div?.getBoundingClientRect().top ?? 0, option];
    }).sort((a, b) => a[0] - b[0]).map(height => height[1]);

    // delete all to force a redraw
    // this resets the moving on ALL
    props.onSetSelected([]);

    props.onSetSelected(sorted);
  }

  return <div data-testid="DraggableSelectedOptions" className={styles.DraggableOptions}>
    {selection}
  </div>;
}

export default DraggableSelectedOptions;
