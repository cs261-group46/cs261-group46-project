import React, { FC } from "react";
import styles from "./MentorshipRequestCard.module.scss";
import Button from "../../../../components/UI/Button/Button";
import { Link } from "react-router-dom";
import BarChart from "../../../../components/UI/BarChart/BarChart";
import Card from "../../../../components/UI/Card/Card";
import { MentorshipRequestType } from "../../../../types/MentorshipRequest";
import Title from "../../../../components/UI/Title/Title";
import Tag from "../../../../components/UI/Tag/Tag";
import { update } from "../../../../api/api";

//Probably need to pass mentor id along
interface MentorshipRequestProp {
  mentorshipRequest: MentorshipRequestType;
}

const MentorshipRequestCard: FC<MentorshipRequestProp> = (props) => {
  //TODO: Given an id, lead to the correct plan of action.
  //TODO: have button send to meeting link instead of dashboard

  const proccessRequestHandler = async (accept: boolean) => {
    const body = {
      accepted: accept,
    };
    try {
      await update({
        resource: "mentorshiprequests",
        entity: props.mentorshipRequest.id,
        body: body,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // const declineRequestHandler = () => {};

  return (
    <Card className={styles.MentorshipRequestCard}>
      <div className={styles.Name}>
        {`${props.mentorshipRequest.mentee.user.first_name} ${props.mentorshipRequest.mentee.user.last_name}`}
      </div>

      <div className={styles.Section}>
        <Title text="About:" className={styles.subtitle} />
        <div className={styles.subtext}>
          {props.mentorshipRequest.mentee.about}
        </div>
      </div>

      <div className={styles.Section}>
        <Title text="Email:" className={styles.subtitle} />
        <div className={styles.subtext}>
          {props.mentorshipRequest.mentee.user.email}
        </div>
      </div>

      <div className={styles.Section}>
        <Title text="Department:" className={styles.subtitle} />
        <div className={styles.subtext}>
          {props.mentorshipRequest.mentee.user.department.name}
        </div>
      </div>

      <div className={styles.Section}>
        <Title text="Interests:" className={styles.subtitle} />
        <div className={`${styles.subtext} ${styles.Interests}`}>
          {props.mentorshipRequest.mentee.topics.map((topic) => (
            <Tag key={topic.topic.id}>{topic.topic.name}</Tag>
          ))}
        </div>
      </div>

      <div className={styles.Buttons}>
        <Button
          className={styles.Button}
          onClick={proccessRequestHandler.bind(null, true)}
          buttonStyle="primary"
        >
          Accept
        </Button>
        <Button
          className={styles.Button}
          onClick={proccessRequestHandler.bind(null, false)}
        >
          Decline
        </Button>
      </div>
    </Card>
  );
};

export default MentorshipRequestCard;
