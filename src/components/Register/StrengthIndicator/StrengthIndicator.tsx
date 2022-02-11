import React, { FC } from 'react';
import styles from './StrengthIndicator.module.scss';
import Twemoji from "react-twemoji";
import passwordInput from "../PasswordInput/PasswordInput";

interface StrengthIndicatorProps {
    password: string
}

const calculateStrength : (string) => number = (password : string) => {
    return Math.min(password.length, 4)
}

const STRENGTH_BRACKETS = [
    {
        icon : '😟',
        percentage: 0
    },
    {
        icon : '😔',
        percentage: 25
    },
    {
        icon : '😌',
        percentage: 50
    },
    {
        icon : '🙂',
        percentage: 75
    },
    {
        icon : '😁',
        percentage: 100
    }
]

const StrengthIndicator: FC<StrengthIndicatorProps> = (props) => {
    const strength = calculateStrength(props.password)
    const {icon, percentage} = STRENGTH_BRACKETS[Math.floor(strength)]

    const indicatorClasses = [styles.Indicator];
    switch (percentage) {
        case 25:
            indicatorClasses.push(styles.s25);
            break;
        case 50:
            indicatorClasses.push(styles.s50);
            break;
        case 75:
            indicatorClasses.push(styles.s75);
            break;
        case 100:
            indicatorClasses.push(styles.s100);
            break;
        default:
            indicatorClasses.push(styles.s0);
    }
    return (
        <div className={styles.StrengthIndicator} data-testid="StrengthIndicator">
            <span>Strength:</span>
            <Twemoji noWrapper={true} options={{className: styles.Emoji}}>
                <div className={styles.Icon}>
                    {icon}
                </div>
            </Twemoji>
            <div className={indicatorClasses.join(" ")}/>
        </div>
    )
};

export default StrengthIndicator;
