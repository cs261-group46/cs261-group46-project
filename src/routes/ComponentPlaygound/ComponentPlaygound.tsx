import React, { FC } from 'react';
import styles from './ComponentPlaygound.module.scss';

interface ComponentPlaygoundProps {}

const ComponentPlaygound: FC<ComponentPlaygoundProps> = () => (
    <div className={styles.ComponentPlaygound} data-testid="ComponentPlaygound">

    </div>
);

export default ComponentPlaygound;
