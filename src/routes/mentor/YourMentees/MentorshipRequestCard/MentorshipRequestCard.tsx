import React, { FC } from "react";
import styles from "./MentorshipRequestCard.module.scss";
import { MentorshipRequestType } from "../../../../types/MentorshipRequest";
import Tag from "../../../../components/UI/Tag/Tag";
import { update } from "../../../../api/api";
import ContentCard from "../../../../components/UI/ContentCard/ContentCard";
import UseSystemMessage from "../../../../hooks/UseSystemMessage/UseSystemMessage";
import { MenteeType } from "../../../../types/Mentee";
import { MenteeFeedbackType } from "../../../../types/MenteeFeedback";

//Probably need to pass mentor id along
interface MentorshipRequestProp {
  mentorshipRequest: MentorshipRequestType;
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

const MentorshipRequestCard: FC<MentorshipRequestProp> = (props) => {
  //TODO: Given an id, lead to the correct plan of action.
  //TODO: have button send to meeting link instead of dashboard
  const showMessage = UseSystemMessage();

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

      props.stateChangingHandler((prevState) => ({
        ...prevState,
        mentor_mentorship_requests_received:
          prevState.mentor_mentorship_requests_received.filter(
            (m) => m.id !== props.mentorshipRequest.id
          ),
      }));

      if (accept) {
        showMessage("success", "Request accepted successfully");

        props.stateChangingHandler((prevState) => {
          const mentor_mentees = [
            ...prevState.mentor_mentees,
            props.mentorshipRequest.mentee,
          ];

          // mentor_mentees.push(
          //   props.mentorshipRequest.mentee as MenteeType
          // ),

          return {
            ...prevState,
            mentor_mentees: mentor_mentees,
          };
        });
      } else showMessage("success", "Request rejected successfully");
    } catch (errors) {
      showMessage("error", errors);
    }
  };

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
      ]}
      buttons={[
        {
          buttonStyle: "primary",
          children: "Accept",
          onClick: proccessRequestHandler.bind(null, true),
        },
        {
          buttonStyle: "default",
          children: "Decline",
          onClick: proccessRequestHandler.bind(null, false),
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
