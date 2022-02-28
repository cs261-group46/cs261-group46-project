import React, { FC, FormEventHandler } from "react";
// import styles from './MentorSignup.module.scss';
import MainLayout from "../../../layouts/MainLayout/MainLayout";
import MultiSelect from "../../../components/UI/FormInput/MultiSelect/MultiSelect";
import {
  MultiSelectOptions,
  SearchPromise,
} from "../../../components/UI/FormInput/MultiSelect/MultiSelect.d";
import useInput from "../../../hooks/UseInput/UseInput";
import Button from "../../../components/UI/Button/Button";
import { useNavigate } from "react-router-dom";
import TextInput from "../../../components/UI/FormInput/TextInput/TextInput";
import useVerifyAuth from "../../../hooks/UseVerifyAuth/UseVerifyAuth";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";

interface MentorSignupProps {}

const MentorSignup: FC<MentorSignupProps> = () => {
  useVerifyAuth();
  let navigate = useNavigate();

  const {
    isInputValid: isSkillsInputValid,
    isValueValid: isSkillsValueValid,
    changeHandler: skillsChangeHandler,
    blurHandler: skillsBlurHandler,
    enteredValue: enteredSkills,
  } = useInput<MultiSelectOptions<string>>(
    [],
    (selectedOptions) => selectedOptions.length > 0
  );

  const {
    isInputValid: isAboutInputValid,
    isValueValid: isAboutValueValid,
    changeHandler: aboutChangeHandler,
    blurHandler: aboutBlurHandler,
    enteredValue: enteredAbout,
  } = useInput<string>("", (about) => about.length > 0 && about.length < 1000);

  const showAllErrors = () => {
    aboutBlurHandler();
    skillsBlurHandler();
  };

  const sendBecomeMentorData = async () => {
    const body = {
      skills: enteredSkills.map((skill) => skill.value),
      about: enteredAbout,
    };

    const response = await fetch("/api/mentors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(body), // body data type must match "Content-Type" header
    });

    // have to do something along the lines of if respone.ok

    const returnedData = await response.json();
    if (returnedData.successful) navigate("/dashboard");
  };

  const submitHandler: FormEventHandler = (event) => {
    event.preventDefault();
    if (isSkillsValueValid && isAboutValueValid) {
      sendBecomeMentorData();

      //   navigate("/dashboard");
    } else {
      showAllErrors();
    }
  };

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

  return (
    <DashboardSubpageLayout title={"Become a Mentor"}>
      <form onSubmit={submitHandler}>
        <MultiSelect
          id={"interests"}
          label={"Mentorship areas"}
          isValid={isSkillsInputValid}
          value={enteredSkills}
          onChange={skillsChangeHandler}
          onBlur={skillsBlurHandler}
          searchPromise={searchPromise}
        />

        <TextInput
          id={"profile"}
          label={"About me"}
          type="textarea"
          placeholder={"I can play Electric Guitar"}
          value={enteredAbout}
          isValid={isAboutInputValid}
          onChange={aboutChangeHandler}
          onBlur={aboutBlurHandler}
        />

        <Button icon="👑" type="submit" buttonStyle={"primary"}>
          Become a Mentor
        </Button>
      </form>

      <div data-testid="MentorSignup" />
    </DashboardSubpageLayout>
  );
};

export default MentorSignup;
