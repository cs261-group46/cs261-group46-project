import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import { get, update } from "../../../api/api";
import UseVerifyAuth from "../../../hooks/UseVerifyAuth/UseVerifyAuth";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import UserDataContext from "../../../store/UserDataContext";
import styles from "./PastMentors.module.scss";
import { MentorType } from "../../../types/Mentor";
import Tag from "../../../components/UI/Tag/Tag";
import ContentCard from "../../../components/UI/ContentCard/ContentCard";
import UseVerifyUser from "../../../hooks/UseVerifyUser/UseVerifyUser";
import Button from "../../../components/UI/Button/Button";
import { MentorFeedbackType } from "../../../types/MentorFeedback";
import StarPicker from "../../../components/UI/FormInput/StarPicker/StarPicker";
import UseSystemMessage from "../../../hooks/UseSystemMessage/UseSystemMessage";
import LoadingSpinner from "../../../components/UI/LoadingSpinner/LoadingSpinner";

interface PastMentorsProps {}

const PastMentors: FC<PastMentorsProps> = () => {
  const { mentee_feedback_given = undefined, mentee_id = null } =
    UseVerifyUser<{
      mentee_feedback_given: any | [];
      mentee_id: number | null;
    }>({
      userDataPolicies: [
        {
          dataPoint: "mentee.feedback_given",
        },
        {
          dataPoint: "mentee.id",
          redirectOnFail: "/dashboard",
        },
      ],
    });

  return (
    <DashboardSubpageLayout title="Past Mentors">
      <div className={styles.PastMentors} data-testid="PastMentors">
        {mentee_id &&
          mentee_feedback_given &&
          mentee_feedback_given.map((feedback: MentorFeedbackType) => (
            <ContentCard
              heading={`${feedback.mentor.user.first_name} ${feedback.mentor.user.last_name}`}
              sections={[
                {
                  title: "Email",
                  content: feedback.mentor.user.email,
                },
                {
                  title: "Department",
                  content: feedback.mentor.user.department.name,
                },
                feedback.feedback !== null && {
                  title: "Feedback given",
                  content: feedback.feedback,
                },
                feedback.score !== null && {
                  title: "Score given",
                  content: (
                    <StarPicker
                      type="inline"
                      value={feedback.score}
                      size="30px"
                    />
                  ),
                },
              ]}
              buttons={[
                feedback.feedback === null && {
                  children: "Give Feedback",
                  buttonStyle: "primary",
                  href: `/learn/past-mentors/give-feedback/${feedback.mentor.id}`,
                },
              ]}
            />
          ))}
        {mentee_feedback_given && mentee_feedback_given.length === 0 && (
          <p>You don't have any past mentors</p>
        )}
        {mentee_feedback_given === undefined && <LoadingSpinner />}
      </div>
    </DashboardSubpageLayout>
  );
};

export default PastMentors;
