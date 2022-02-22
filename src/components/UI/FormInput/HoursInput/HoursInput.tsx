import React, {FC, useEffect, useState} from 'react';
import styles from './HoursInput.module.scss';
import ClockInput from "./ClockInput";

export type Range = [number, number];

interface HoursInputProps {
  label: string;
  isValid: boolean;
  value: Range[];
  onChange: (input: Range[]) => void;
  onBlur: () => void;
}

function boolsToRanges(input: boolean[]) {
  var inARange = false; // if currently defining a range or waiting for a new start
  var rangeStart = -1;
  var ranges: Range[] = [];

  for (let i = 0; i < 12; i++) {
    if (!inARange && input[i]) {
      inARange = true;
      rangeStart = i;
    }
    if (inARange && !input[i]) {
      inARange = false;
      ranges.push([rangeStart, i-1]);
    }
  }

  if (inARange)
    ranges.push([rangeStart, 11]);

  return ranges;
}

const HoursInput: FC<HoursInputProps> = (props) => {
  const { onChange } = props;
  const [amTime, setAmTime] = useState(Array(12).fill(false));
  const [pmTime, setPmTime] = useState(Array.from(amTime));
  const [stopInfiniteLoop, setStopInfiniteLoop] = useState(false);
  const width = "200px";

  useEffect(() => {
    if (!stopInfiniteLoop) {
      onChange(boolsToRanges(amTime).concat(boolsToRanges(pmTime)));
      setStopInfiniteLoop(true);
    }
  }, [amTime, pmTime, onChange, stopInfiniteLoop]);


  return <div className={styles.HoursInput} data-testid="HoursInput">
    <div>
      {/* for onchange - not the best solution. otherwise it infinitely loops and im not sure why */}
      <ClockInput value={amTime} onChange={value => {setStopInfiniteLoop(false); setAmTime(value)}} onBlur={props.onBlur} width={width} label={"AM"}/>
      <div className={styles.times}>
        {/*there are so many edge cases dealing with hours*/}
        {/*0 hour is really twelve*/}
        {/*it must flip to pm for the last hour*/}
        {boolsToRanges(amTime).map(([from, to]) => <p key={`(${from},${to})`}>
          {`${(from !== 0 ? from : 12).toString().padStart(2,"0")}:00AM - 
          ${(to+1).toString().padStart(2,"0")}:00${to !== 11 ? "AM" : "PM"}`}
        </p>)}
      </div>
    </div>
    <div>
      <ClockInput value={pmTime} onChange={value => {setStopInfiniteLoop(false); setPmTime(value)}} onBlur={props.onBlur} width={width} label={"PM"}/>
      <div className={styles.times}>
        {boolsToRanges(pmTime).map(([from, to]) => <p key={`(${from},${to})`}>
          {`${(from !== 0 ? from : 12).toString().padStart(2,"0")}:00PM -
           ${(to+1).toString().padStart(2,"0")}:00${to !== 11 ? "PM" : "AM"}`}
        </p>)}
      </div>
    </div>
  </div>
}

// y = rsin0
// x = rcos0

export default HoursInput;
