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
  mentee: MenteeType;
  onTerminateMentorship: (mentee: MenteeType) => void;
}

const MenteeCard: FC<MenteeProp> = (props) => {
  //TODO: Given an id, lead to the correct plan of action.
  //TODO: have button send to meeting link instead of dashboard
  const completedPlans = props.mentee.plans_of_action.filter(
    (plan) => plan.status === "completed"
  );

  const [showWarning, setShowWarning] = useState(false);

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
            onClick={props.onTerminateMentorship.bind(null, props.mentee)}
          >
            Confirm
          </Button>
          <Button onClick={setShowWarning.bind(null, false)}>Cancel</Button>
        </SystemMessage>
      )}
    </>
  );
};

export default MenteeCard;
