import React, {FC, useState} from 'react';
import styles from './ComponentPlaygound.module.scss';
import PageStepper from "../../components/UI/PageStepper/PageStepper";
import PieView from "../../components/UI/PieView/PieView";

interface ComponentPlaygoundProps {}

const ComponentPlaygound: FC<ComponentPlaygoundProps> = () => {
    const [page, setPage] = useState(0);

    return <div className={styles.ComponentPlaygound} data-testid="ComponentPlaygound">
        <PageStepper page={page} setPage={setPage} maxPages={5}/>
        <PieView segments={[
            {fr: 2, fill: "#07A417", label: "Active"},
            {fr: 1, fill: "#393838", label: "Completed"}
        ]}/>
    </div>
}

export default ComponentPlaygound;
