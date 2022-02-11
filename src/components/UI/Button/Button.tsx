import React, { FC } from 'react';
import styles from './Button.module.scss';
import Icon from "../Icon/Icon";

interface ButtonProps {
    children: React.ReactNode;
    icon?: React.ReactNode;
}

const Button: FC<ButtonProps> = (props)  => {

    return (<div className={styles.Button} data-testid="Button">
        {props.icon && <Icon icon={props.icon} className={styles.Icon}/>}
        {props.children}
    </div>)
};

export default Button;
