import React, { FC, FormEventHandler, useContext } from "react";
// import styles from './MentorSignup.module.scss';
import {
  MultiSelectOptions,
  SearchPromise,
} from "../../../components/UI/FormInput/SearchSelect/SearchSelect.d";
import useInput from "../../../hooks/UseInput/UseInput";
import Button from "../../../components/UI/Button/Button";
import { useNavigate } from "react-router-dom";
import TextInput from "../../../components/UI/FormInput/TextInput/TextInput";
import useVerifyAuth from "../../../hooks/UseVerifyAuth/UseVerifyAuth";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import { index, store } from "../../../api/api";
import SearchSelect from "../../../components/UI/FormInput/SearchSelect/SearchSelect";
import BigTextInput from "../../../components/UI/FormInput/BigTextInput/BigTextInput";
import UserDataContext from "../../../store/UserDataContext";

interface MentorSignupProps {}

const MentorSignup: FC<MentorSignupProps> = () => {
  const userDataCtx = useContext(UserDataContext);

  useVerifyAuth();

  let navigate = useNavigate();

  const {
    isInputValid: isSkillsInputValid,
    isValueValid: isSkillsValueValid,
    changeHandler: skillsChangeHandler,
    blurHandler: skillsBlurHandler,
    enteredValue: enteredSkills,
  } = useInput<MultiSelectOptions<number>>(
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
    enteredValue: capacity,
  } = useInput<string>("", () => true);

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

      userDataCtx.updateMentorId();
      navigate("/dashboard"); // show message instead
    } catch (errors) {
      console.log(errors);
    }
  };

  const submitHandler: FormEventHandler = (event) => {
    event.preventDefault();
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
      const options: MultiSelectOptions<number> = data.map(
        ({ label, id }: { label: string; id: number }) => ({ label, value: id })
      );
      console.log(options);

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
      <form onSubmit={submitHandler}>
        <SearchSelect
          id={"interests"}
          label={"Mentorship areas"}
          isValid={isSkillsInputValid}
          value={enteredSkills}
          onChange={skillsChangeHandler}
          onBlur={skillsBlurHandler}
          searchPromise={searchPromise}
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
          value={capacity}
          type={"number"}
          isValid={isCapacityInputValid}
          onChange={capacityChangeHandler}
          onBlur={capacityBlurHandler}
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
