import React, { FC } from "react";
import styles from "./MentorshipRequestCard.module.scss";
import { MentorshipRequestType } from "../../../../types/MentorshipRequest";
import Tag from "../../../../components/UI/Tag/Tag";
import { update } from "../../../../api/api";
import ContentCard from "../../../../components/UI/ContentCard/ContentCard";
import UseSystemMessage from "../../../../hooks/UseSystemMessage/UseSystemMessage";
import { MenteeType } from "../../../../types/Mentee";
import { MenteeFeedbackType } from "../../../../types/MenteeFeedback";
import StarPicker from "../../../../components/UI/FormInput/StarPicker/StarPicker";

//Probably need to pass mentor id along
interface MentorshipRequestProp {
  mentorshipRequest: MentorshipRequestType;
  onProcessRequest: (
    mentorshipRequest: MentorshipRequestType,
    accepted: boolean
  ) => void;
}

const MentorshipRequestCard: FC<MentorshipRequestProp> = (props) => {
  //TODO: Given an id, lead to the correct plan of action.
  //TODO: have button send to meeting link instead of dashboard

  return (
    <ContentCard
      heading={`${props.mentorshipRequest.mentee.user.first_name} ${props.mentorshipRequest.mentee.user.last_name}`}
      sections={[
        {
          title: "About",
          content: props.mentorshipRequest.mentee.about,
        },
        {
          title: "Email",
          content: props.mentorshipRequest.mentee.user.email,
        },
        {
          title: "Department",
          content: props.mentorshipRequest.mentee.user.department.name,
        },
        {
          title: "Interests",
          className: styles.Interests,
          content: props.mentorshipRequest.mentee.topics.map((topic) => (
            <Tag key={topic.topic.id}>{topic.topic.name}</Tag>
          )),
        },
        {
          title: "Rating",
          content: (
            <StarPicker
              type="inline"
              value={Math.round(props.mentorshipRequest.mentee.score)}
              size={"30px"}
            />
          ),
        },
      ]}
      buttons={[
        {
          buttonStyle: "primary",
          children: "Accept",
          onClick: props.onProcessRequest.bind(
            null,
            props.mentorshipRequest,
            true
          ),
        },
        {
          buttonStyle: "default",
          children: "Decline",
          onClick: props.onProcessRequest.bind(
            null,
            props.mentorshipRequest,
            false
          ),
        },
      ]}
    />
    // <Card className={styles.MentorshipRequestCard}>
    //   <div className={styles.Name}>
    //     {`${props.mentorshipRequest.mentee.user.first_name} ${props.mentorshipRequest.mentee.user.last_name}`}
    //   </div>

    //   <div className={styles.Section}>
    //     <Title text="About:" className={styles.subtitle} />
    //     <div className={styles.subtext}>
    //       {props.mentorshipRequest.mentee.about}
    //     </div>
    //   </div>

    //   <div className={styles.Section}>
    //     <Title text="Email:" className={styles.subtitle} />
    //     <div className={styles.subtext}>
    //       {props.mentorshipRequest.mentee.user.email}
    //     </div>
    //   </div>

    //   <div className={styles.Section}>
    //     <Title text="Department:" className={styles.subtitle} />
    //     <div className={styles.subtext}>
    //       {props.mentorshipRequest.mentee.user.department.name}
    //     </div>
    //   </div>

    //   <div className={styles.Section}>
    //     <Title text="Interests:" className={styles.subtitle} />
    //     <div className={`${styles.subtext} ${styles.Interests}`}>
    //       {props.mentorshipRequest.mentee.topics.map((topic) => (
    //         <Tag key={topic.topic.id}>{topic.topic.name}</Tag>
    //       ))}
    //     </div>
    //   </div>

    //   <div className={styles.Buttons}>
    //     <Button
    //       className={styles.Button}
    //       onClick={proccessRequestHandler.bind(null, true)}
    //       buttonStyle="primary"
    //     >
    //       Accept
    //     </Button>
    //     <Button
    //       className={styles.Button}
    //       onClick={proccessRequestHandler.bind(null, false)}
    //     >
    //       Decline
    //     </Button>
    //   </div>
    // </Card>
  );
};

export default MentorshipRequestCard;
