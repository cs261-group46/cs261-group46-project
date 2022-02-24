import React, {FC, useState} from 'react';
import styles from './ComponentPlaygound.module.scss';
import PageStepper from "../../components/UI/PageStepper/PageStepper";

interface ComponentPlaygoundProps {}

const ComponentPlaygound: FC<ComponentPlaygoundProps> = () => {
    const [page, setPage] = useState(0);

    return <div className={styles.ComponentPlaygound} data-testid="ComponentPlaygound">
        <PageStepper page={page} setPage={setPage} maxPages={5}/>
    </div>
}

export default ComponentPlaygound;
