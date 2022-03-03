import React, { FC } from "react";
import Card from "../../../UI/Card/Card";
import styles from "./MentorCard.module.scss";
import { MentorType } from "../../../../types/Mentor";
import Title from "../../../UI/Title/Title";
import Tag from "../../../UI/Tag/Tag";
import Button from "../../../UI/Button/Button";
import { custom } from "../../../../api/api";

interface MentorCardProps {
  mentor: MentorType;
}

const MentorCard: FC<MentorCardProps> = (props) => {
  const skillTags = props.mentor.topics.map((topic) => (
    <Tag key={topic.id}>{topic.name}</Tag>
  ));

  const requestMentorHandler = async () => {
    try {
      const body = {
        mentor: props.mentor.id,
      };

      await custom({
        endpoint: "/mentors/request",
        method: "POST",
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
