import React, {
  FC,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { get, update } from "../../../api/api";
import UseVerifyAuth from "../../../hooks/UseVerifyAuth/UseVerifyAuth";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import UserDataContext from "../../../store/UserDataContext";
import styles from "./YourMentor.module.scss";
import { MentorType } from "../../../types/Mentor";
import Tag from "../../../components/UI/Tag/Tag";
import ContentCard from "../../../components/UI/ContentCard/ContentCard";
import UseVerifyUser from "../../../hooks/UseVerifyUser/UseVerifyUser";
import Button from "../../../components/UI/Button/Button";
import LoadingSpinner from "../../../components/UI/LoadingSpinner/LoadingSpinner";
import UseSystemMessage from "../../../hooks/UseSystemMessage/UseSystemMessage";
import SystemMessage from "../../../components/UI/SystemMessage/SystemMessage";

interface YourMentorProps {}

const YourMentor: FC<YourMentorProps> = () => {
  const { mentee_mentor = undefined, mentee_id = undefined } = UseVerifyUser<{
    mentee_mentor: MentorType | null | undefined;
    mentee_id: number | null | undefined;
  }>({
    userDataPolicies: [
      {
        dataPoint: "mentee.mentor",
      },
      {
        dataPoint: "mentee.id",
        redirectOnFail: "/dashboard",
      },
    ],
  });
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
      showMessage("success", "Mentorship terminated successfully.");
    } catch (errors) {
      showMessage("error", errors);
    }
  };

  return (
    <DashboardSubpageLayout title="Your Mentor">
      <div className={styles.YourMentor} data-testid="YourMentor">
        <Button href="/learn/past-mentors">Past Mentors</Button>
        {mentee_id && mentee_mentor ? (
          <>
            <ContentCard
              heading={`${mentee_mentor.user.first_name} ${mentee_mentor.user.last_name}`}
              sections={[
                {
                  title: "About",
                  content: mentee_mentor.about,
                },
                {
                  title: "Email",
                  icon: "✉️",
                  content: mentee_mentor.user.email,
                },
                {
                  title: "Department",
                  content: mentee_mentor.user.department.name,
                },
                {
                  title: "Mentorship Areas",
                  className: styles.Skills,
                  content: mentee_mentor.topics.map((topic) => (
                    <Tag key={topic.topic.id}>{topic.topic.name}</Tag>
                  )),
                },
              ]}
              buttons={[
                {
                  buttonStyle: "primary",
                  children: "Meetings",
                  icon: "👥",
                  href: `/meetings/${mentee_id}`,
                },
                {
                  buttonStyle: "default",
                  children: "Terminate Partnership",
                  icon: "📈",
                  onClick: setShowWarning.bind(null, true),
                },
              ]}
            />
            <SystemMessage
              sort={"popup"}
              type={"alert"}
              description={`Are you sure you want to terminate the partnership?`}
              visible={showWarning}
              onClose={setShowWarning.bind(null, false)}
            >
              <Button
                buttonStyle="primary"
                onClick={terminateMentorshipHandler.bind(null, mentee_id)}
              >
                Confirm
              </Button>
              <Button onClick={setShowWarning.bind(null, false)}>Cancel</Button>
            </SystemMessage>
          </>
        ) : (
          <Fragment>
            {mentee_id === undefined && <LoadingSpinner />}
            {mentee_id === null && (
              <p>You don't have a mentor at the moment. </p>
            )}
          </Fragment>
        )}
      </div>
    </DashboardSubpageLayout>
  );
};

export default YourMentor;
