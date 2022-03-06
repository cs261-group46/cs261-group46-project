import React, { FC, useContext } from "react";
import Card from "../../../UI/Card/Card";
import styles from "./MentorCard.module.scss";
import { MentorType } from "../../../../types/Mentor";
import Title from "../../../UI/Title/Title";
import Tag from "../../../UI/Tag/Tag";
import Button from "../../../UI/Button/Button";
import { store } from "../../../../api/api";
import UserDataContext from "../../../../store/UserDataContext";
import UseVerifyUser from "../../../../hooks/UseVerifyUser/UseVerifyUser";

interface MentorCardProps {
  mentor: MentorType;
}

const MentorCard: FC<MentorCardProps> = (props) => {
  const { mentee_id = null } = UseVerifyUser<{
    mentee_id: number | null | undefined;
  }>({
    userDataPolicies: [
      {
        dataPoint: "mentee.id",
        redirectOnFail: "/dashboard",
      },
      {
        dataPoint: "mentee.mentor.id",
      },
    ],
  });

  const skillTags = props.mentor.topics.map((topic) => {
    console.log(topic);
    return <Tag key={topic.topic.id}>{topic.topic.name}</Tag>;
  });

  const requestMentorHandler = async () => {
    try {
      const body = {
        mentorshiprequest: {
          mentee: mentee_id,
          mentor: props.mentor.id,
        },
      };

      await store({
        resource: "mentorshiprequests",
        body: body,
      });
    } catch (errors) {
      console.log(errors);
    }
  };
  return (
    <Card>
      <div className={styles.MentorCard} data-testid={"MentorCard"}>
        <div
          className={styles.Name}
        >{`${props.mentor.user.first_name} ${props.mentor.user.last_name}`}</div>
        <div className={styles.Details}>
          <Title className={styles.Title} text={"Email"} />
          <p>{props.mentor.user.email}</p>
          <Title className={styles.Title} text={"About"} />
          <p>{props.mentor.about}</p>
          <Title className={styles.Title} text={"Skills"} />
          <div className={styles.Skills}>{skillTags}</div>
          <Title className={styles.Title} text={"Department"} />
          <p>{props.mentor.user.department.name}</p>
        </div>
        <div className={styles.Buttons}>
          <Button
            buttonStyle="primary"
            onClick={requestMentorHandler}
            className={styles.Button}
          >
            Request Mentor
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MentorCard;
