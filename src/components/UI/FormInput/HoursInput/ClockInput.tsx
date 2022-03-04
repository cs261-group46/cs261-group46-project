import React, { FC, MouseEvent, useState } from "react";
import styles from "./ClockInput.module.scss";
import segmentHighlight from "./segment_highlight.svg";
import segmentBlocked from "./segment_blocked.svg";
import segment from "./segment.svg";
import clockFace from "./face.svg";

interface ClockInputProps {
  value: boolean[];
  onChange: (input: boolean[]) => void;
  onBlur: () => void;
  width?: string;
  label?: string;
  allowedHours?: boolean[];
  hoursLeft?: number;
}

const ClockInput: FC<ClockInputProps> = (props) => {
  const [mouseDown, setMouseDown] = useState(false);
  const [initialClickState, setInitialClickState] = useState(false);

  /**
   * From a click event, determines the index in the array that was clicked
   * @param event
   */
  const getClickedIndex = (event: MouseEvent<HTMLImageElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    // centre x and y to middle of the element
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    // uses atan2 to convert to an angle and does some processing to allign it to the slot correctly
    return 12 - Math.ceil(Math.atan2(x, y) / (Math.PI / 6) + 6);
  };

  const flip = (i: number) => {
    props.onChange(
      props.value.map((bool, replaceIndex) => {
        if (i === replaceIndex) {
          // if trying to flip to true but theres no hours left
          if (!bool && props.hoursLeft !== undefined && props.hoursLeft === 0) {
            return bool;
          } else return !bool;
        } else return bool; // dont affect the other hours
      })
    );
  };

  const getSrc = (i: number) => {
    if (props.allowedHours && !props.allowedHours[i]) return segmentBlocked;
    if (props.value[i]) return segmentHighlight;
    return segment;
  };

  return (
    <div className={styles.ClockInput}>
      {
        // reversed so slice 0 is on top - leads to easier math
        Array.from(Array(12).keys())
          .reverse()
          .map((i) => (
            <img
              src={getSrc(i)}
              width={props.width}
              key={i}
              className={styles.segment}
              alt="Clock Face"
              style={{ rotate: `${i * 30}deg` }}
              onMouseDown={(event) => {
                const clickedIndex = getClickedIndex(event);
                setMouseDown(true);
                // store whether the initial segment was on/off.
                setInitialClickState(props.value[clickedIndex]);
                // also flip this val when you click
                // if theres a filter set, obey it
                if (props.allowedHours) {
                  if (props.allowedHours[clickedIndex]) flip(clickedIndex);
                }
                // else just flip it
                else flip(clickedIndex);
              }}
              onMouseUp={() => {
                setMouseDown(false);
                props.onBlur();
              }}
              onMouseMove={(event) => {
                if (mouseDown) {
                  const clickedIndex = getClickedIndex(event);
                  // for any segments the same value as what you clicked initially
                  if (props.value[clickedIndex] === initialClickState)
                    if (props.allowedHours) {
                      if (props.allowedHours[clickedIndex]) flip(clickedIndex);
                    }
                    // else just flip it
                    else flip(clickedIndex);
                }
              }}
              // need to stop image dragging
              onDragStart={(event) => event.preventDefault()}
            />
          ))
      }
      <p className={styles.label}>{props.label}</p>
      <img src={clockFace} alt="Clock Face" width={props.width} />
    </div>
  );
};

export default ClockInput;
