import React, { FC, useEffect, useState } from "react";
import styles from "./HoursInput.module.scss";
import ClockInput from "./ClockInput";
import Label from "../Label/Label";

export type Range = [number, number];

interface HoursInputProps {
  label: string;
  isValid: boolean;
  value: Range[];
  onChange: (input: Range[]) => void;
  onBlur: () => void;
  width?: string;
  allowedRanges?: Range[];
  maxHours?: number;
}

function boolsToRanges(input: boolean[]) {
  var inARange = false; // if currently defining a range or waiting for a new start
  var rangeStart = -1;
  var ranges: Range[] = [];

  for (let i = 0; i < 24; i++) {
    if (!inARange && input[i]) {
      inARange = true;
      rangeStart = i;
    }
    if (inARange && !input[i]) {
      inARange = false;
      ranges.push([rangeStart, i]);
    }
  }

  if (inARange) ranges.push([rangeStart, 24]);

  return ranges;
}

/**
 * Converts an hour 0-24 to a time string e.g 01:00PM
 */
function hourToString(hour: number) {
  function pad(hour: number) {
    return hour.toString().padStart(2, "0");
  }

  if (hour === 0) return "12:00AM";
  if (hour > 0 && hour < 12) return `${pad(hour)}:00AM`;
  if (hour === 12) return "12:00PM";
  if (hour > 12 && hour < 24) return `${pad(hour - 12)}:00PM`;
  if (hour === 24) return "12:00AM";
}

function rangesToHours(ranges: Range[]) {
  const hours: boolean[] = Array(24).fill(false);

  return ranges.reduce(
    (acc, range) =>
      // flip to true if this i is in the range
      acc.map((value, i) => value || (i >= range[0] && i < range[1])),
    hours
  );
}

const HoursInput: FC<HoursInputProps> = (props) => {
  const { onChange } = props;
  const [amTime, setAmTime] = useState(Array(12).fill(false));
  const [pmTime, setPmTime] = useState(Array.from(amTime));
  const [stopInfiniteLoop, setStopInfiniteLoop] = useState(false);
  const width = props.width ?? "200px";
  const hours = amTime.concat(pmTime);
  const ranges = boolsToRanges(hours);
  const hoursLeft = props.maxHours
    ? props.maxHours - hours.filter((hour) => hour).length
    : undefined;

  console.log(hoursLeft);
  const allowedHours = props.allowedRanges
    ? rangesToHours(props.allowedRanges)
    : undefined;

  useEffect(() => {
    if (!stopInfiniteLoop) {
      onChange(ranges);
      setStopInfiniteLoop(true);
    }
  }, [ranges, onChange, stopInfiniteLoop]);

  return (
    <div className={styles.HoursInput} data-testid="HoursInput">
      {/* TODO: add these to props */}
      <div className={styles.label}>
        <Label htmlFor={""} icon={""}>
          {props.label}
        </Label>
      </div>
      <div className={styles.clocks}>
        {/* for onchange - not the best solution. otherwise it infinitely loops and im not sure why */}
        <ClockInput
          value={amTime}
          onChange={(value) => {
            setStopInfiniteLoop(false);
            setAmTime(value);
          }}
          onBlur={props.onBlur}
          width={width}
          label={"AM"}
          allowedHours={allowedHours ? allowedHours.slice(0, 12) : undefined}
          hoursLeft={hoursLeft}
        />
        <ClockInput
          value={pmTime}
          onChange={(value) => {
            setStopInfiniteLoop(false);
            setPmTime(value);
          }}
          onBlur={props.onBlur}
          width={width}
          label={"PM"}
          allowedHours={allowedHours ? allowedHours.slice(12, 23) : undefined}
          hoursLeft={hoursLeft}
        />
      </div>
      <div className={styles.times}>
        <p>Hours left: {hoursLeft}</p>
        {/*there are so many edge cases dealing with hours*/}
        {/*0 hour is really twelve*/}
        {/*it must flip to pm for the last hour*/}
        {ranges.map(([from, to]) => (
          <p key={`(${from},${to})`}>
            {hourToString(from)} - {hourToString(to)}
          </p>
        ))}
      </div>
    </div>
  );
};

// y = rsin0
// x = rcos0

export default HoursInput;
