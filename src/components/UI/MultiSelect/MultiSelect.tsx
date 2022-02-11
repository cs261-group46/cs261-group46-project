import React, {FC} from 'react';
import styles from './MultiSelect.module.scss';

interface MultiSelectProps {
    options: string[]
    setOptions: React.Dispatch<React.SetStateAction<string[]>>
}

const MultiSelect: FC<MultiSelectProps> = () => {
    return <div className={styles.MultiSelect} data-testid="MultiSelect">
        MultiSelect Component
    </div>
};

export default MultiSelect;
