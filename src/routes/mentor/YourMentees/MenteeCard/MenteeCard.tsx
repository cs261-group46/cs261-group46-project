import React, { FC } from "react";
import styles from "./MenteeCard.module.scss";
import Button from "../../../../components/UI/Button/Button";
import { Link } from "react-router-dom";
import BarChart from "../../../../components/UI/BarChart/BarChart";
import Card from "../../../../components/UI/Card/Card";

//Probably need to pass mentor id along
interface MenteeProp {
  id: number;
  firstname: string;
  lastname: string;
  completedGoal: number;
  totalGoal: number;
}

const MenteeCard: FC<MenteeProp> = (props) => {
  //TODO: Given an id, lead to the correct plan of action.
  //TODO: have button send to meeting link instead of dashboard
  return (
    <Card className={styles.MenteeCard}>
      {`${props.firstname} ${props.lastname}`}
      <BarChart
        className={styles.BarChart}
        completedGoals={props.completedGoal}
        totalGoals={props.totalGoal}
      />
      <div className={styles.Buttons}>
        <Button
          className={styles.Button}
          href={"/dashboard"}
          buttonStyle="primary"
          icon={"👥"}
        >
          Meetings
        </Button>
        <Button
          className={styles.Button}
          href={"/learn/plans-of-action"}
          icon={"📈"}
        >
          View Plan
        </Button>
      </div>
    </Card>
  );
};

export default MenteeCard;
