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
import { index, store } from "../../../api/api";

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
    try {
      const requestBody = {
        skills: enteredSkills.map((skill) => skill.value),
        about: enteredAbout,
      };
      await store({
        resource: "mentors",
        body: requestBody,
      });
      navigate("/dashboard"); // show message instead
    } catch (errors) {
      console.log(errors);
    }
  };

  const submitHandler: FormEventHandler = (event) => {
    event.preventDefault();
    if (isSkillsValueValid && isAboutValueValid) {
      sendBecomeMentorData();
    } else {
      showAllErrors();
    }
  };

  const getTopics = async (startsWith: string) => {
    try {
      const data = await index({
        resource: "topics",
        args: {
          startswith: startsWith,
        },
      });
      const options: MultiSelectOptions<number> = data.map(
        ({ label, id }: { label: string; id: number }) => ({ label, value: id })
      );
      return options;
    } catch (errors) {
      console.log(errors);
    }
  };

  const searchPromise: SearchPromise = (_search) => {
    return new Promise((resolve) => resolve(getTopics(_search)));
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
