import React, { FC } from "react";
import styles from "./MenteeCard.module.scss";
import BarChart from "../../../../components/UI/BarChart/BarChart";
import { MenteeType } from "../../../../types/Mentee";
import Tag from "../../../../components/UI/Tag/Tag";
import ContentCard from "../../../../components/UI/ContentCard/ContentCard";
import { update } from "../../../../api/api";

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
  const completedPlans = props.mentee.plans_of_action.filter(
    (plan) => plan.status === "completed"
  );

  const terminateMentorshipHandler = async (menteeId: number) => {
    try {
      const body = {
        mentor: -1,
      };
      await update({
        entity: menteeId,
        resource: "mentees",
        body: body,
      });
    } catch (errors) {
      console.log(errors);
    }
  };

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
          content:
            props.mentee.plans_of_action.length > 0 ? (
              <BarChart
                className={styles.BarChart}
                completedGoals={completedPlans.length}
                totalGoals={props.mentee.plans_of_action.length}
              />
            ) : (
              "No plans of action set"
            ),
        },
      ]}
      buttons={[
        {
          buttonStyle: "primary",
          children: "Meetings",
          icon: "👥",
          href: `/meetings/${props.mentee.id}`,
        },
        {
          buttonStyle: "default",
          children: "View Plan",
          icon: "📈",
          href: `/plans-of-action/${props.mentee.id}`,
        },
        {
          buttonStyle: "default",
          children: "Terminate Partnership",
          icon: "📈",
          onClick: terminateMentorshipHandler.bind(null, props.mentee.id),
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
