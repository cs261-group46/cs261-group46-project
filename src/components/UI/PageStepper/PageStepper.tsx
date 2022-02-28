import React, { FC } from 'react';
import styles from './PageStepper.module.scss';
import arrow from './arrow.svg'

interface PageStepperProps {
    page: number;
    setPage: (newPage: number) => void;
    maxPages: number;
}

const PageStepper: FC<PageStepperProps> = (props) => {
    const circle =
        <svg width="8" height="8" viewBox="0 0 8 8">
            <circle cx="4" cy="4" r="4" fill="#AFAFAF"/>
        </svg>

    const highlightcircle =
        <svg width="10" height="10" viewBox="0 0 10 10">
            <circle cx="5" cy="5" r="5" fill="#EA596E"/>
        </svg>

    return <div className={styles.PageStepper} data-testid="PageStepper">
        <button className={styles.backbutton} onClick={() => props.setPage(props.page - 1)}>
            <img src={arrow} alt="left arrow" width="20" height="20"/>
        </button>
        <div className={styles.progress}>
            {Array(props.maxPages).fill(0).map((_, i) =>
                 <div key={i}>{i === props.page ? highlightcircle : circle}</div>
            )}
        </div>
        <button className={styles.forwardbutton} onClick={() => props.setPage(props.page + 1)}>
            <img src={arrow} className={styles.flip} alt="left arrow" width="20" height="20"/>
        </button>
    </div>
}

export default PageStepper;
