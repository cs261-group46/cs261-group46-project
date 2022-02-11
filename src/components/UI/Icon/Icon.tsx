import React, { FC } from 'react';
import styles from './Icon.module.scss';
import Twemoji from "react-twemoji";

interface IconProps {
    icon: React.ReactNode;
    className?: string
}

const Icon: FC<IconProps> = (props) => (
  <Twemoji noWrapper={true} options={{className: styles.Emoji}}>
        <div className={props.className}>
            {props.icon}
        </div>
  </Twemoji>
);

export default Icon;
