import React, { FC } from "react";
import Card from "../../../UI/Card/Card";
import styles from "./MentorCard.module.scss";
import { Mentor } from "../MentorIndex.d";
import Title from "../../../UI/Title/Title";
import Tag from "../../../UI/Tag/Tag";

interface MentorCardProps {
  mentor: Mentor;
}

const MentorCard: FC<MentorCardProps> = (props) => {
  const skillTags = props.mentor.topics.map((topic) => (
    <Tag key={topic.id}>{topic.name}</Tag>
  ));

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
      </div>
    </Card>
  );
};

export default MentorCard;
