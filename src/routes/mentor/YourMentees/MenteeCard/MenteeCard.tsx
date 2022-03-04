import React, { FC } from "react";
import styles from "./MenteeCard.module.scss";
import Button from "../../../../components/UI/Button/Button";
import { Link } from "react-router-dom";
import BarChart from "../../../../components/UI/BarChart/BarChart";
import Card from "../../../../components/UI/Card/Card";
import { MenteeType } from "../../../../types/Mentee";
import Title from "../../../../components/UI/Title/Title";
import Tag from "../../../../components/UI/Tag/Tag";
import ContentCard from "../../../../components/UI/ContentCard/ContentCard";

//Probably need to pass mentor id along
interface MenteeProp {
  //   id: number;
  //   firstname: string;
  //   lastname: string;
  //   completedGoal: number;
  //   totalGoal: number;
  mentee: MenteeType;
}

const MenteeCard: FC<MenteeProp> = (props) => {
  //TODO: Given an id, lead to the correct plan of action.
  //TODO: have button send to meeting link instead of dashboard
  return (
    <ContentCard
      heading={`${props.mentee.user.first_name} ${props.mentee.user.last_name}`}
      sections={[
        {
          title: "About",
          content: props.mentee.about,
        },
        {
          title: "Email",
          icon: "✉️",
          content: props.mentee.user.email,
        },
        {
          title: "Department",
          content: props.mentee.user.department.name,
        },
        {
          title: "Interests",
          className: styles.Interests,
          content: props.mentee.topics.map((topic) => (
            <Tag key={topic.topic.id}>{topic.topic.name}</Tag>
          )),
        },
        {
          title: "Plan of Action progress",
          content: (
            <BarChart
              className={styles.BarChart}
              completedGoals={20}
              totalGoals={100}
            />
          ),
        },
      ]}
      buttons={[
        {
          buttonStyle: "primary",
          children: "Meetings",
          icon: "👥",
          href: "/dashboard",
        },
        {
          buttonStyle: "default",
          children: "View Plan",
          icon: "📈",
          href: "/learn/plans-of-action",
        },
      ]}
    />

    // <Card className={styles.MenteeCard}>
    //   <div className={styles.Name}>
    //     {`${props.mentee.user.first_name} ${props.mentee.user.last_name}`}
    //   </div>

    //   <div className={styles.Section}>
    //     <Title text="About:" className={styles.subtitle} />
    //     <div className={styles.subtext}>{props.mentee.about}</div>
    //   </div>

    //   <div className={styles.Section}>
    //     <Title text="Email:" className={styles.subtitle} />
    //     <div className={styles.subtext}>{props.mentee.user.email}</div>
    //   </div>

    //   <div className={styles.Section}>
    //     <Title text="Department:" className={styles.subtitle} />
    //     <div className={styles.subtext}>
    //       {props.mentee.user.department.name}
    //     </div>
    //   </div>

    //   <div className={styles.Section}>
    //     <Title text="Interests:" className={styles.subtitle} />
    //     <div className={`${styles.subtext} ${styles.Interests}`}>
    //       {props.mentee.topics.map((topic) => (
    //         <Tag key={topic.topic.id}>{topic.topic.name}</Tag>
    //       ))}
    //     </div>
    //   </div>

    //   <div className={styles.Section}>
    //     <Title text="Plan of Action progress:" className={styles.subtitle} />
    //     <BarChart
    //       className={styles.BarChart}
    //       completedGoals={20}
    //       totalGoals={100}
    //     />
    //   </div>

    //   <div className={styles.Buttons}>
    //     <Button
    //       className={styles.Button}
    //       href={"/dashboard"}
    //       buttonStyle="primary"
    //       icon={"👥"}
    //     >
    //       Meetings
    //     </Button>
    //     <Button
    //       className={styles.Button}
    //       href={"/learn/plans-of-action"}
    //       icon={"📈"}
    //     >
    //       View Plan
    //     </Button>
    //   </div>
    // </Card>
  );
};

export default MenteeCard;
