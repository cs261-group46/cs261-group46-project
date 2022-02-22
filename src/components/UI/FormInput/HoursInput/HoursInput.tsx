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
    const x = (event.clientX - rect.left) - (rect.width / 2);
    const y = (event.clientY - rect.top) - (rect.height / 2);
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
              // onClick={(event) => {
              //   const rect = event.currentTarget.getBoundingClientRect();
              //   const x = (event.clientX - rect.left) - (rect.width / 2);
              //   const y = (event.clientY - rect.top) - (rect.height / 2);
              //   const clickedI = (12 - Math.ceil((Math.atan2(x,y) / (Math.PI / 6)) + 6));
              //   props.onChange(props.value.map((bool, replaceI) => clickedI === replaceI ? !bool : bool))
              // }}
              onMouseDown={(event) => {
                setMouseDown(true);
                setInitialClickState(props.value[getClickedIndex(event)]);
              }}
              onMouseUp={() => setMouseDown(false)}
              onMouseMove={(event) => {
                if (mouseDown) {
                  const clickedIndex = getClickedIndex(event);
                  if (props.value[clickedIndex] === initialClickState)
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
