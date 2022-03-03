import React, { FC } from "react";
// import Title from '../../../components/UI/Title/Title';
import styles from "./Event.module.scss";
import Card from "../../UI/Card/Card";
import Icon from "../../UI/Icon/Icon";

import { EventProps } from "./Event.d";

interface Props {
  event: EventProps;
}

const Event: FC<Props> = (props) => (
  <Card>
    <div className={styles.Event} data-testid={"Event"}>
      <div className={styles.splitCard}>
        <div className={styles.dateTimeSquare}>
          <div className={styles.date}>5 March 2022</div>
          <div className={styles.time}>10am-11am</div>
        </div>
        <div className={styles.details}>
          <div className={styles.sessionType}>
            <Icon
              icon={"🖥" ? props.event.sessionType === "Workshop" : "📚"}
              className={styles.Icon}
            />
            {props.event.sessionType}
          </div>
          <div>{props.event.subject}</div>
          <br />
          <div>
            Mentor: <span>{props.event.mentor}</span>
          </div>
          <div>
            Mentee: <span>{props.event.mentee}</span>
          </div>
        </div>
      </div>
    </div>
  </Card>
);

export default Event;
