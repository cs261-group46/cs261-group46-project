import React, { FC } from 'react';
import styles from './ComponentPlaygound.module.scss';
import HoursInput from "../../components/UI/FormInput/HoursInput/HoursInput";

interface ComponentPlaygoundProps {}

const ComponentPlaygound: FC<ComponentPlaygoundProps> = () => (
    <div className={styles.ComponentPlaygound} data-testid="ComponentPlaygound">
        <HoursInput label={"hour"} isValid={true} value={[]} onChange={() => {}} onBlur={() => {}}/>
    </div>
);

export default ComponentPlaygound;
