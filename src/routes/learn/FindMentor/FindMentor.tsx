import React, { FC } from "react";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import UseVerifyAuth from "../../../hooks/UseVerifyAuth/UseVerifyAuth";
import MentorIndex from "../../../components/learn/MentorIndex/MentorIndex";
import Title from "../../../components/UI/Title/Title";

interface FindMentorProps {}

const FindMentor: FC<FindMentorProps> = () => {
  UseVerifyAuth();

  return (
    <DashboardSubpageLayout title="Find a Mentor">
      <Title text={"Recommended Mentors"} />
      <MentorIndex />
      <div data-testid="FindMentor" />
    </DashboardSubpageLayout>
  );
};

export default FindMentor;
