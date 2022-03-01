import React, { FC } from "react";
import Card from "../../../UI/Card/Card";
import styles from "./MentorCard.module.scss";
import { Mentor } from "../MentorIndex.d";
import Title from "../../../UI/Title/Title";
import Tag from "../../../UI/Tag/Tag";
import Button from "../../../UI/Button/Button";

interface MentorCardProps {
  mentor: Mentor;
}

const MentorCard: FC<MentorCardProps> = (props) => {
  const skillTags = props.mentor.topics.map((topic) => (
    <Tag key={topic.id}>{topic.name}</Tag>
  ));

  const requestMentorHandler = async () => {
    try {
      const requestBody = {
        mentor: props.mentor.id,
      };

      const response = await fetch("/api/mentors/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(requestBody), // body data type must match "Content-Type" header
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors || ["Unexpected error occurred"]);
      }
    } catch (errors) {
      console.log(errors);
    }
  };
  return (
    <Card>
      <div className={styles.MentorCard}>
        <div
          className={styles.Name}
        >{`${props.mentor.user.first_name} ${props.mentor.user.last_name}`}</div>
        <div className={styles.Details}>
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
