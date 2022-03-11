import React, { FC, useEffect, useState } from "react";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import UseVerifyUser from "../../../hooks/UseVerifyUser/UseVerifyUser";
import ContentCard from "../../../components/UI/ContentCard/ContentCard";
import StarPicker from "../../../components/UI/FormInput/StarPicker/StarPicker";
import { MentorFeedbackType } from "../../../types/MentorFeedback";

interface MenteeFeedbacksProps {}

// TODO : FINISH THIS

const MenteeFeedbacks: FC<MenteeFeedbacksProps> = () => {
  const { mentee_received_feedback = [] } = UseVerifyUser<{
    userId: number | null;
    mentee_received_feedback: MentorFeedbackType[] | [];
  }>({
    userDataPolicies: [
      {
        dataPoint: "mentor.id",
      },
      {
        dataPoint: "mentee.received_feedback",
      },
    ],
  });

  const [feedbackReceived, setFeedbackReceived] = useState<
    MentorFeedbackType[]
  >([]);

  useEffect(() => {
    const filtered_feedbacks = mentee_received_feedback.filter(
      (feedback) => feedback.feedback != null
    );
    setFeedbackReceived(filtered_feedbacks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(mentee_received_feedback)]);

  const feedbackReceivedList = feedbackReceived.map(
    (feedback: MentorFeedbackType, index: number) => (
      <ContentCard
        key={index}
        heading={`${feedback.mentor.user.first_name} ${feedback.mentor.user.last_name}`}
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
        <p>You haven't received any feedback from your mentors yet.</p>
      )}
      {feedbackReceivedList.length > 0 && feedbackReceivedList}

      <div data-testid="MenteeFeedbacks" />
    </DashboardSubpageLayout>
  );
};

export default MenteeFeedbacks;
