import React, { FC } from "react";
import Button from "../Button/Button";
import styles from "./PagePicker.module.scss";

interface PagePickerProps {
  pickers: {
    onClick: () => void;
    selected: boolean;
    className?: string;
    highlighted?: boolean;
    text: string;
  }[];
}

const PagePicker: FC<PagePickerProps> = (props) => (
  <div className={styles.PagePicker} data-testid="PagePicker">
    {props.pickers.map((picker) => (
      <Button
        className={`${picker.className ?? ""} ${
          picker.selected ? styles.Selected : ""
        } ${styles.picker} ${picker.highlighted ? styles.Highlighted : ""}`}
        onClick={picker.onClick}
      >
        {picker.text}
      </Button>
    ))}
  </div>
);

export default PagePicker;
