import React, { FC, useState } from "react";
import styles from "./MenteeCard.module.scss";
import BarChart from "../../../../components/UI/BarChart/BarChart";
import { MenteeType } from "../../../../types/Mentee";
import Tag from "../../../../components/UI/Tag/Tag";
import ContentCard from "../../../../components/UI/ContentCard/ContentCard";
import { destroy, update } from "../../../../api/api";
import UseSystemMessage from "../../../../hooks/UseSystemMessage/UseSystemMessage";
import SystemMessage from "../../../../components/UI/SystemMessage/SystemMessage";
import Button from "../../../../components/UI/Button/Button";
import { MentorshipRequestType } from "../../../../types/MentorshipRequest";
import { MenteeFeedbackType } from "../../../../types/MenteeFeedback";

//Probably need to pass mentor id along
interface MenteeProp {
  //   id: number;
  //   firstname: string;
  //   lastname: string;
  //   completedGoal: number;
  //   totalGoal: number;
  mentee: MenteeType;
  stateChangingHandler: React.Dispatch<
    React.SetStateAction<{
      userId: number | null | undefined;
      mentor_id: number | null | undefined;
      mentor_mentees: MenteeType[] | [];
      mentor_mentorship_requests_received: MentorshipRequestType[] | [];
      mentor_feedback_given: MenteeFeedbackType[] | [];
    }>
  >;
}

const MenteeCard: FC<MenteeProp> = (props) => {
  //TODO: Given an id, lead to the correct plan of action.
  //TODO: have button send to meeting link instead of dashboard
  const completedPlans = props.mentee.plans_of_action.filter(
    (plan) => plan.status === "completed"
  );

  const showMessage = UseSystemMessage();
  const [showWarning, setShowWarning] = useState(false);

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
      props.stateChangingHandler((prevState) => ({
        ...prevState,
        mentor_mentees: prevState.mentor_mentees.filter(
          (m) => m.id !== menteeId
        ),
      }));
      showMessage("success", "Mentorship terminated successfully");
    } catch (errors) {
      showMessage("error", errors);
    }
  };

  return (
    <>
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
            onClick: setShowWarning.bind(null, true),
          },
        ]}
      />
      {showWarning && (
        <SystemMessage
          sort={"popup"}
          type={"alert"}
          description={`Are you sure you want to terminate the partnership?`}
          visible={showWarning}
          onClose={setShowWarning.bind(null, false)}
        >
          <Button
            buttonStyle="primary"
            onClick={terminateMentorshipHandler.bind(null, props.mentee.id)}
          >
            Confirm
          </Button>
          <Button onClick={setShowWarning.bind(null, false)}>Cancel</Button>
        </SystemMessage>
      )}
    </>

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
