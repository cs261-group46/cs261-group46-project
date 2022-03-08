import React, { FC } from "react";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import UseVerifyAuth from "../../../hooks/UseVerifyAuth/UseVerifyAuth";
import MentorIndex from "../../../components/learn/MentorIndex/MentorIndex";
import Title from "../../../components/UI/Title/Title";
import UseVerifyUser from "../../../hooks/UseVerifyUser/UseVerifyUser";

interface FindMentorProps {}

const FindMentor: FC<FindMentorProps> = () => {
  const { mentee_id = null, mentee_mentor_id = null } = UseVerifyUser<{
    mentee_id: number | null | undefined;
    mentee_mentor_id: number | null | undefined;
  }>({
    userDataPolicies: [
      {
        dataPoint: "mentee.id",
        redirectOnFail: "/dashboard",
      },
      {
        dataPoint: "mentee.mentor.id",
        redirectOnSuccess: "/dashboard",
      },
    ],
  });

  return (
    <DashboardSubpageLayout title="Find a Mentor">
      <Title text={"Recommended Mentors"} />
      <MentorIndex />
      <div data-testid="FindMentor" />
    </DashboardSubpageLayout>
  );
};

export default FindMentor;
