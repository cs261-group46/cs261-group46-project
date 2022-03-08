import React, { FC } from "react";
// import styles from './MentorSignup.module.scss';
import {
  SearchSelectOptions,
  SearchPromise,
} from "../../../components/UI/FormInput/SearchSelect/SearchSelect";
import useInput from "../../../hooks/UseInput/UseInput";
import Button from "../../../components/UI/Button/Button";
import { useNavigate } from "react-router-dom";
import TextInput from "../../../components/UI/FormInput/TextInput/TextInput";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import { index, store } from "../../../api/api";
import SearchSelect from "../../../components/UI/FormInput/SearchSelect/SearchSelect";
import BigTextInput from "../../../components/UI/FormInput/BigTextInput/BigTextInput";
import UseVerifyUser from "../../../hooks/UseVerifyUser/UseVerifyUser";

interface MentorSignupProps {}

const MentorSignup: FC<MentorSignupProps> = () => {
  const {
    userId = null,
    // mentor_id = null
  } = UseVerifyUser<{
    userId: number | null | undefined;
    mentor_id: number | null | undefined;
  }>({
    userDataPolicies: [
      {
        dataPoint: "mentor.id",
        redirectOnSuccess: "/dashboard",
      },
    ],
  });

  let navigate = useNavigate();

  const {
    isInputValid: isSkillsInputValid,
    isValueValid: isSkillsValueValid,
    changeHandler: skillsChangeHandler,
    blurHandler: skillsBlurHandler,
    enteredValue: enteredSkills,
  } = useInput<SearchSelectOptions<number>>(
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

  const {
    isInputValid: isCapacityInputValid,
    isValueValid: isCapacityValueValid,
    changeHandler: capacityChangeHandler,
    blurHandler: capacityBlurHandler,
    enteredValue: enteredCapacity,
  } = useInput<string>("", (input) => parseInt(input) > 0);

  const sendBecomeMentorData = async () => {
    try {
      const requestBody = {
        skills: enteredSkills.map((skill, index) => ({
          priority: index + 1,
          skill: skill.value,
        })),
        about: enteredAbout,
        capacity: parseInt(enteredCapacity),
        user_id: userId,
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

  const showAllErrors = () => {
    aboutBlurHandler();
    skillsBlurHandler();
    capacityBlurHandler();
  };

  const submitHandler = () => {
    if (isSkillsValueValid && isAboutValueValid && isCapacityValueValid) {
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
      const options: SearchSelectOptions<number> = data.topics.map(
        ({ name, id }: { name: string; id: number }) => ({
          label: name,
          value: id,
        })
      );

      return options;
    } catch (errors) {
      console.log(errors);
      return [];
    }
  };

  const searchPromise: SearchPromise<number> = (_search) => {
    return new Promise((resolve) => resolve(getTopics(_search)));
  };

  return (
    <DashboardSubpageLayout title={"Become a Mentor"}>
      <SearchSelect
        id={"skills"}
        label={"Mentorship areas"}
        isValid={isSkillsInputValid}
        value={enteredSkills}
        onChange={skillsChangeHandler}
        onBlur={skillsBlurHandler}
        searchPromise={searchPromise}
        type={"draggable"}
      />

      <BigTextInput
        id={"profile"}
        label={"About me"}
        placeholder={"I can play Electric Guitar"}
        value={enteredAbout}
        isValid={isAboutInputValid}
        onChange={aboutChangeHandler}
        onBlur={aboutBlurHandler}
      />

      <TextInput
        id={"capacity"}
        label={"How many mentees do you want?"}
        placeholder={"e.g. 5"}
        value={enteredCapacity}
        type={"number"}
        isValid={isCapacityInputValid}
        onChange={capacityChangeHandler}
        onBlur={capacityBlurHandler}
      />

      <Button icon="👑" onClick={submitHandler} buttonStyle={"primary"}>
        Become a Mentor
      </Button>

      <div data-testid="MentorSignup" />
    </DashboardSubpageLayout>
  );
};

export default MentorSignup;
