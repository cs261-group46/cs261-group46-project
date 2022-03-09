import React, { FC, Fragment, useEffect, useState } from "react";
import styles from "./StarPicker.module.scss";
import Label from "../Label/Label";
import StarSvg from "./Star";
import SystemMessage from "../../SystemMessage/SystemMessage";

interface InteractiveStarPickerProps {
  id: string;
  label: string;
  type: "interactive";
  icon?: React.ReactNode;
  value: number | undefined;
  isValid: boolean;
  onChange: (input: number) => void;
  onBlur: () => void;
  size?: string;
}

interface InlineStarPickerProps {
  type: "inline";
  value: number;
  size?: string;
  isValid?: boolean; // for hook reasons this must be included - ugh
}

const StarPicker: FC<InteractiveStarPickerProps | InlineStarPickerProps> = (
  props
) => {
  const [hovered, setHovered] = useState<number>();
  const [isInvalidMessageVisible, setInvalidMessageVisible] = useState(false);

  useEffect(() => {
    setInvalidMessageVisible(!props.isValid);
  }, [props.type, props.isValid]);

  function getFill(index: number) {
    if (hovered) {
      return index <= hovered ? "#FFBFD4" : "none";
    } else {
      return index <= (props.value ?? 0) ? "#EA596E" : "none";
    }
  }

  return (
    <Fragment>
      {props.type === "interactive" && (
        <div className={styles.StarPicker} data-testid="StarPicker">
          <Label htmlFor={props.id} icon={props.icon}>
            {props.label}
          </Label>
          <div className={styles.starholder}>
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index + 1}
                  className={styles.star}
                  onClick={() => {
                    props.onChange(index + 1);
                    props.onBlur(); // not much better place to 'blur'
                    setHovered(undefined); // turn off the hover effect to show user their choice
                  }}
                  onMouseEnter={() => {
                    console.log(index + 1);
                    setHovered(index + 1);
                  }}
                  onMouseLeave={() => setHovered(undefined)}
                >
                  <StarSvg fill={getFill(index + 1)} size={props.size} />
                </div>
              ))}
          </div>
          <SystemMessage
            sort="inline"
            type="alert"
            description={`The ${props.label} field seems to be incorrect`}
            visible={isInvalidMessageVisible}
          />
        </div>
      )}
      {props.type === "inline" && (
        <span>
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <StarSvg
                fill={index < (props.value ?? 0) ? "#EA596E" : "none"}
                size={props.size}
              />
            ))}
        </span>
      )}
    </Fragment>
  );
};

export default StarPicker;
