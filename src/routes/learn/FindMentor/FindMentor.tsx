import React, { FC, FormEventHandler, useCallback, useEffect } from "react";
// import styles from './MenteeSignup.module.scss';
import MainLayout from "../../../layouts/MainLayout/MainLayout";
import MultiSelect from "../../../components/UI/FormInput/MultiSelect/MultiSelect";
import {
  MultiSelectOptions,
  SearchPromise,
} from "../../../components/UI/FormInput/MultiSelect/MultiSelect.d";
import useInput from "../../../hooks/UseInput/UseInput";
import Button from "../../../components/UI/Button/Button";
import { useNavigate } from "react-router-dom";
import { get, index, update } from "../../../api/api";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import UseVerifyAuth from "../../../hooks/UseVerifyAuth/UseVerifyAuth";
import MentorIndex from "../../../components/learn/MentorIndex/MentorIndex";
import Title from "../../../components/UI/Title/Title";

interface MenteeSignupProps {}

function validateInterests(_experises: MultiSelectOptions<number>) {
  return true;
}

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
