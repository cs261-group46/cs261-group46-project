import React, { FC } from "react";
import styles from "./StarPicker.module.scss";

interface StarPickerProps {
  id: string;
  label: string;
  value: number | undefined;
  isValid: boolean;
  onChange: (input: number) => void;
  onBlur: () => void;
}

const StarPicker: FC<StarPickerProps> = () => (
  <div className={styles.StarPicker} data-testid="StarPicker">
    StarPicker Component
  </div>
);

export default StarPicker;
