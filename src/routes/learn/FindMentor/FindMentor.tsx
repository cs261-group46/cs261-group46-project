import React, { FC } from "react";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import UseVerifyAuth from "../../../hooks/UseVerifyAuth/UseVerifyAuth";
import MentorIndex from "../../../components/learn/MentorIndex/MentorIndex";
import Title from "../../../components/UI/Title/Title";

interface MenteeSignupProps {}

const MenteeSignup: FC<MenteeSignupProps> = () => {
  UseVerifyAuth();

  return (
    <DashboardSubpageLayout title="Find a Mentor">
      <Title text={"Recommended Mentors"} />
      <MentorIndex />
    </DashboardSubpageLayout>
  );
};

export default MenteeSignup;
