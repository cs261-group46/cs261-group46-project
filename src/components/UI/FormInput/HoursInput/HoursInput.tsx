import React, {FC, MouseEvent, useState} from 'react';
import styles from './HoursInput.module.scss';
import clockFace from './face.svg'
import segment from './segment.svg'
import segmentHighlight from './segment_highlight.svg'

interface HoursInputProps {
  label: string;
  isValid: boolean;
  value: boolean[];
  onChange: (input: boolean[]) => void;
  onBlur: () => void;
}

const HoursInput: FC<HoursInputProps> = (props) => {
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

  return <div className={styles.HoursInput} data-testid="HoursInput">
    {
      // reversed so slice 0 is on top - leads to easier math
      Array.from(Array(12).keys()).reverse().map(i =>
          <img
              src={props.value[i] ? segmentHighlight : segment}
              key={i}
              className={styles.segment}
              alt="Clock Face"
              style={{rotate: `${i * 30}deg`}}
              onMouseDown={(event) => {
                setMouseDown(true);
                // store whether the initial segment was on/off.
                setInitialClickState(props.value[getClickedIndex(event)]);
              }}
              onMouseUp={() => setMouseDown(false)}
              onMouseMove={(event) => {
                if (mouseDown) {
                  const clickedIndex = getClickedIndex(event);
                  // for any segments the same value as what you clicked initially
                  if (props.value[clickedIndex] === initialClickState)
                    // flip them
                    props.onChange(props.value.map((bool, replaceIndex) => clickedIndex === replaceIndex ? !bool : bool))
                }
              }}

              // need to stop image dragging
              onDragStart={(event) => event.preventDefault()}
          />
      )
    }
    <img src={clockFace} className={styles.clockFace} alt="Clock Face"/>
  </div>
}

// y = rsin0
// x = rcos0

export default HoursInput;
