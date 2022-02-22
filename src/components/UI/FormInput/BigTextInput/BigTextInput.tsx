import React, { ChangeEventHandler, FC } from 'react';
import styles from './BigTextInput.module.scss';
import Label from '../Label/Label';

interface BigTextInputProps {
  id: string;
  label: string;
  placeholder: string;
  icon?: React.ReactNode;
  className?: any;
  value: string | undefined;
  isValid: boolean;
  onChange: (input: string) => void;
  onBlur: () => void;
}

const BigTextInput: FC<BigTextInputProps> = props => {
  const changeHandler: ChangeEventHandler<HTMLTextAreaElement> = event => {
    const target = event.target;
    if (target) {
      props.onChange(target.value);
    }
  };

  return (
    <div className={styles.BigTextInput} data-testid='BigTextInput'>
      <Label htmlFor={props.id} icon={props.icon}>
        {props.label}
      </Label>
      <textarea
        value={props.value}
        name={props.id}
        id={props.id}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={props.onBlur}
      />
    </div>
  );
};

export default BigTextInput;
