import React, { FC, useEffect, useState } from "react";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import UseVerifyUser from "../../../hooks/UseVerifyUser/UseVerifyUser";
import ContentCard from "../../../components/UI/ContentCard/ContentCard";
import { MenteeFeedbackType } from "../../../types/MenteeFeedback";
import StarPicker from "../../../components/UI/FormInput/StarPicker/StarPicker";

interface MentorFeedbacksProps {}

const MentorFeedbacks: FC<MentorFeedbacksProps> = () => {
  const { userId = null, mentor_received_feedback = [] } = UseVerifyUser<{
    userId: number | null;
    mentor_received_feedback: MenteeFeedbackType[] | [];
  }>({
    userDataPolicies: [
      {
        dataPoint: "mentor.id",
        redirectOnFail: "/dashboard",
      },
      {
        dataPoint: "mentor.received_feedback",
      },
    ],
  });

  const [feedbackReceived, setFeedbackReceived] = useState<
    MenteeFeedbackType[]
  >([]);

  useEffect(() => {
    const filtered_feedbacks = mentor_received_feedback.filter(
      (feedback) => feedback.feedback != null
    );
    setFeedbackReceived(filtered_feedbacks);
  }, [JSON.stringify(mentor_received_feedback)]);

  const feedbackReceivedList = feedbackReceived.map(
    (feedback: MenteeFeedbackType, index: number) => (
      <ContentCard
        key={index}
        heading={`${feedback.mentee.user.first_name} ${feedback.mentee.user.last_name}`}
        sections={[
          {
            title: "Feedback received",
            content: feedback.feedback,
          },
          {
            title: "Score received",
            content: (
              <StarPicker
                type="inline"
                value={feedback.score as number}
                size={"30px"}
              />
            ),
          },
        ]}
      />
    )
  );

  return (
    <DashboardSubpageLayout title="Your Mentees">
      {feedbackReceivedList.length === 0 && (
        <p>You haven't received any feedback from your mentees yet.</p>
      )}
      {feedbackReceivedList.length > 0 && feedbackReceivedList}

      <div data-testid="MentorFeedbacks" />
    </DashboardSubpageLayout>
  );
};

export default MentorFeedbacks;
