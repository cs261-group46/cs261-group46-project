import React, {FC, MouseEvent, useState} from "react";
import styles from "./ClockInput.module.scss";
import segmentHighlight from "./segment_highlight.svg";
import segment from "./segment.svg";
import clockFace from "./face.svg";

interface ClockInputProps {
  value: boolean[];
  onChange: (input: boolean[]) => void;
  onBlur: () => void;
  width?: string;
  label?: string;
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
    const x = (event.clientX - rect.left) - (rect.width / 2);
    const y = (event.clientY - rect.top) - (rect.height / 2);
    // uses atan2 to convert to an angle and does some processing to allign it to the slot correctly
    return (12 - Math.ceil((Math.atan2(x, y) / (Math.PI / 6)) + 6));
  }

  const flip = (i: number) => {
    props.onChange(props.value.map((bool, replaceIndex) => i === replaceIndex ? !bool : bool))
  }

  return <div className={styles.ClockInput} data-testid="HoursInput">
    {
      // reversed so slice 0 is on top - leads to easier math
      Array.from(Array(12).keys()).reverse().map(i =>
          <img
              src={props.value[i] ? segmentHighlight : segment}
              width={props.width}
              key={i}
              className={styles.segment}
              alt="Clock Face"
              style={{rotate: `${i * 30}deg`}}
              onMouseDown={(event) => {
                setMouseDown(true);
                // store whether the initial segment was on/off.
                setInitialClickState(props.value[getClickedIndex(event)]);
                // also flip this val when you click
                flip(getClickedIndex(event));
              }}
              onMouseUp={() => setMouseDown(false)}
              onMouseMove={(event) => {
                if (mouseDown) {
                  const clickedIndex = getClickedIndex(event);
                  // for any segments the same value as what you clicked initially
                  if (props.value[clickedIndex] === initialClickState)
                    flip(clickedIndex);
                }
              }}

              // need to stop image dragging
              onDragStart={(event) => event.preventDefault()}
          />
      )
    }
    <p className={styles.label}>{props.label}</p>
    <img src={clockFace} alt="Clock Face" width={props.width}/>
  </div>
}


export default ClockInput