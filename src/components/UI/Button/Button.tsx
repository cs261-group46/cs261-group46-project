import React, { FC } from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
    children: React.ReactNode
}

const Button: FC<ButtonProps> = (props)  => {

    return (<div className={styles.Button} data-testid="Button">{props.children}
    </div>)
};

export default Button;
