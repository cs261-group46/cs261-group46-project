import React, { PropsWithChildren, useRef, useState } from "react";
import styles from "./DraggableSelectedOptions.module.scss";
import {
  SearchSelectOptions,
  SearchSelectOption,
  RemoveSelectedHandler,
  SetSelectedHandler,
} from "../SearchSelect";
import Draggable, { DraggableBounds } from "react-draggable";
import Label from "../../Label/Label";

interface SelectedOptionsProps<T> {
  selected: SearchSelectOptions<T>;
  onRemoveSelected: RemoveSelectedHandler<T>;
  onSetSelected: SetSelectedHandler<T>;
}

function DraggableSelectedOptions<T>(
  props: PropsWithChildren<SelectedOptionsProps<T>>
) {
  const [currentDragged, setCurrentDragged] = useState<number>();
  const ref = useRef(null);
  const refs = useRef<HTMLDivElement[]>([]);

  function calcBounds(index: number): DraggableBounds | undefined {
    const box = refs.current[index]?.getBoundingClientRect();
    const topBox = refs.current[0]?.getBoundingClientRect();
    const bottomBox =
      refs.current[refs.current.length - 1]?.getBoundingClientRect();

    if (box && topBox && bottomBox)
      return {
        // the bounds are relative, so need to subtract from pos of top box
        // also a bit of extra room (height) to make the element a bit smoother
        top: topBox.top - box.top - box.height,
        bottom: bottomBox.bottom - box.bottom + box.height,
      };
    else return undefined;
  }

  const selection = props.selected.map((option, index) => (
    <Draggable
      axis={"y"}
      key={index}
      handle={".handle"}
      nodeRef={ref}
      onStart={() => setCurrentDragged(index)}
      bounds={calcBounds(index)}
      onStop={() => {
        setCurrentDragged(-1);
        reorderList();
      }}
    >
      <div
        ref={ref}
        className={currentDragged === index ? styles.clickedwrapper : ""}
      >
        <div
          ref={(el) => {
            if (el) refs.current[index] = el;
          }}
          className={`${styles.DraggableOption} handle ${
            currentDragged === index && styles.clicked
          }`}
          style={{ zIndex: currentDragged === index ? 1 : "initial" }}
        >
          <p>{option.label}</p>
          <button
            id="remove-button"
            onMouseDown={(event) => {
              event.stopPropagation();
              props.onRemoveSelected(option.value);
              refs.current.splice(index, 1);
            }}
          >
            X
          </button>
        </div>
      </div>
    </Draggable>
  ));

  function reorderList() {
    const sorted = props.selected
      .map<[number, SearchSelectOption<T>]>((option, index) => {
        const div = refs.current[index];

        return [div?.getBoundingClientRect().top ?? 0, option];
      })
      .sort((a, b) => a[0] - b[0])
      .map((height) => height[1]);

    // delete all to force a redraw
    // this resets the moving on ALL
    props.onSetSelected([]);

    props.onSetSelected(sorted);
  }

  return (
    <div
      data-testid="DraggableSelectedOptions"
      className={styles.DraggableOptions}
    >
      {props.selected.length > 0 && (
        <Label htmlFor={""} className={styles.DragLabel}>
          Drag to rearrange your options in order of priority
        </Label>
      )}
      {selection}
    </div>
  );
}

export default DraggableSelectedOptions;
