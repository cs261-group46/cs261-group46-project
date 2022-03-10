import React, { FC } from "react";
import Button from "../Button/Button";
import Icon from "../Icon/Icon";
import styles from "./PagePicker.module.scss";

interface PagePickerProps {
  pickers: {
    onClick: () => void;
    selected: boolean;
    className?: string;
    highlighted?: boolean;
    text: string;
  }[];
  buttons: {
    buttonLeft: () => void;
    buttonRight: () => void;
  };
}

const PagePicker: FC<PagePickerProps> = (props) => (
  <div className={styles.PagePicker} data-testid="PagePicker">
    {props.buttons && (
      <button className={styles.sideButton} onClick={props.buttons.buttonLeft}>
        <Icon icon="⬅️" className={styles.Icon} />
      </button>
    )}
    <div className={styles.pickers}>
      {props.pickers.map((picker, index) => (
        <Button
          key={index}
          className={`${picker.className ?? ""} ${
            picker.selected ? styles.Selected : ""
          } ${styles.picker} ${picker.highlighted ? styles.Highlighted : ""}`}
          onClick={picker.onClick}
        >
          {picker.text}
        </Button>
      ))}
    </div>
    <div className={styles.dots}>
      {props.pickers.map((picker, index) => (
        <div
          key={index}
          className={`${styles.dot} ${
            picker.selected ? styles.SelectedDot : ""
          }`}
        ></div>
      ))}
    </div>
    {props.buttons && (
      <button className={styles.sideButton} onClick={props.buttons.buttonRight}>
        <Icon icon="➡️" className={styles.Icon} />
      </button>
    )}
  </div>
);

export default PagePicker;
