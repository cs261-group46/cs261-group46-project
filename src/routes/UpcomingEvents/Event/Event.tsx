import React, { FC } from 'react';
import Title from '../../../components/UI/Title/Title';
import styles from './Event.module.scss';
import Card from '../../../components/UI/Card/Card';
import { EventProps } from './Event.d';

interface Props {
  event: EventProps;
}

const Event: FC<Props> = props => (
  <Card>
    <div className={styles.Event}>
      <div className={styles.splitCard}>
        <div className={styles.dateTimeSquare}>
          <span className={styles.span}>5</span> <br /> March <br /> 10AM-11AM
        </div>
        <div className={styles.details}>
          <div className={styles.sessionType}>{props.event.sessionType}</div>
          <div>{props.event.subject}</div>
          <br />
          <div>Mentor: {props.event.mentor}</div>
          <div>Mentee: {props.event.mentee}</div>
        </div>
      </div>
    </div>
  </Card>
);

export default Event;
