import React, { FC, FormEventHandler, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/UI/Button/Button";
import MultiSelect from "../../../components/UI/FormInput/MultiSelect/MultiSelect";
import {
  MultiSelectOptions,
  SearchPromise,
} from "../../../components/UI/FormInput/MultiSelect/MultiSelect.d";
import useInput from "../../../hooks/UseInput/UseInput";
import UseVerifyAuth from "../../../hooks/UseVerifyAuth/UseVerifyAuth";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import MainLayout from "../../../layouts/MainLayout/MainLayout";
import styles from "./MentorSkills.module.scss";

interface MentorSkillsProps {}

function validateInterests(_experises: MultiSelectOptions<number>) {
  return true;
}

const MentorSkills: FC<MentorSkillsProps> = () => {
  UseVerifyAuth();
  const navigate = useNavigate();

  const fetchTopics = async (startsWith: string) => {
    const body = {
      query: startsWith,
    };

    const response = await fetch(`/api/topics?startswith=${startsWith}`);
    const returnedData = await response.json();
    const options: MultiSelectOptions<number> = returnedData.result.map(
      ({ label, id }: { label: string; id: number }) => ({ label, value: id })
    );
    return options;
  };

  const searchPromise: SearchPromise = (_search) => {
    return new Promise((resolve) => resolve(fetchTopics(_search)));
  };

  const {
    enteredValue: enteredSkills,
    isInputValid: isInputSkillsValid,
    isValueValid: isValueSkillsValid,
    changeHandler: skillsChangeHandler,
    blurHandler: skillsBlurHandler,
  } = useInput<MultiSelectOptions<number>>([], validateInterests);

  const fetchSkills = useCallback(async () => {
    const response = await fetch("/api/mentors?fields=topics");
    const returnedData = await response.json();

    const topicsOptions: MultiSelectOptions<number> =
      returnedData.data.mentor.topics.map(
        (topic: { id: number; name: string }) => ({
          value: topic.id,
          label: topic.name,
        })
      );
    skillsChangeHandler(topicsOptions);
  }, [skillsChangeHandler]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const sendSkillsData = async () => {
    const body = {
      skills: enteredSkills.map((skill) => skill.value),
    };

    const response = await fetch("/api/mentors", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(body), // body data type must match "Content-Type" header
    });

    const returnedData = await response.json();
    if (returnedData.successful) navigate("/dashboard");
  };

  const submitHandler: FormEventHandler = (event) => {
    event.preventDefault();
    if (isValueSkillsValid) {
      sendSkillsData();
    } else {
      skillsBlurHandler();
    }
  };

  return (
    <DashboardSubpageLayout title="Your Mentorship Areas">
      <form onSubmit={submitHandler}>
        <MultiSelect
          id="skills"
          label="Areas of Mentorship"
          value={enteredSkills}
          isValid={isInputSkillsValid}
          onChange={skillsChangeHandler}
          onBlur={skillsBlurHandler}
          icon="💪"
          searchPromise={searchPromise}
        />

        <Button icon="➡️" buttonStyle="primary" type="submit">
          Apply
        </Button>
      </form>
    </DashboardSubpageLayout>
    // <div className={styles.MentorSkills} data-testid="MentorSkills">
    //   MentorSkills Component
    // </div>
  );
};

export default MentorSkills;
