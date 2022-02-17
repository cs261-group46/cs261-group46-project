import React, { FC } from 'react';
import styles from './Title.module.scss';

interface TitleProps {
    text: string
}

const Title: FC<TitleProps> = (props) => (
    <p className={styles.Title} data-testid="Title">{props.text}</p>
);

export default Title;
