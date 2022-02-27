import React, { FC } from 'react';
import styles from './ComponentPlaygound.module.scss';
import PieView from "../../components/UI/PieView/PieView";

interface ComponentPlaygoundProps {}

const ComponentPlaygound: FC<ComponentPlaygoundProps> = () => (
    <div className={styles.ComponentPlaygound} data-testid="ComponentPlaygound">
        <PieView segments={[
            {fr: 2, fill: "#07A417", label: "Active"},
            {fr: 1, fill: "#393838", label: "Completed"}
        ]}/>
    </div>
);

export default ComponentPlaygound;
