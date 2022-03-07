import React, { FC, FormEventHandler, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { index, store } from "../../../api/api";
import Button from "../../../components/UI/Button/Button";
import BigTextInput from "../../../components/UI/FormInput/BigTextInput/BigTextInput";
import SearchSelect from "../../../components/UI/FormInput/SearchSelect/SearchSelect";
import {
  SearchSelectOptions,
  SearchPromise,
} from "../../../components/UI/FormInput/SearchSelect/SearchSelect";
import useInput from "../../../hooks/UseInput/UseInput";
import UseVerifyUser from "../../../hooks/UseVerifyUser/UseVerifyUser";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";

interface MenteeSignupProps {}

function validateInterests(_experises: SearchSelectOptions<number>) {
  return true;
}

const MenteeSignup: FC<MenteeSignupProps> = () => {
  const { userId = null, mentee_id = null } = UseVerifyUser<{
    userId: number | null | undefined;
    mentee_id: number | null | undefined;
  }>({
    userDataPolicies: [
      {
        dataPoint: "mentee.id",
        redirectOnSuccess: "/dashboard",
      },
    ],
  });

  const navigate = useNavigate();

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

  const {
    enteredValue: enteredInterests,
    isInputValid: isInputInterestsValid,
    isValueValid: isValueInterestsValid,
    changeHandler: interestsChangeHandler,
    blurHandler: interestsBlurHandler,
  } = useInput<SearchSelectOptions<number>>([], validateInterests);

  const {
    isInputValid: isAboutInputValid,
    isValueValid: isAboutValueValid,
    changeHandler: aboutChangeHandler,
    blurHandler: aboutBlurHandler,
    enteredValue: enteredAbout,
  } = useInput<string>("", (about) => about.length > 0 && about.length < 1000);

  const sendBecomeMenteeData = async () => {
    try {
      const requestBody = {
        user_id: userId,
        interests: enteredInterests.map((interest, index) => ({
          priority: index + 1,
          interest: interest.value,
        })),
        about: enteredAbout,
      };

      await store({
        resource: "mentees",
        body: requestBody,
      });

      navigate("/dashboard"); // show message instead
    } catch (errors) {
      console.log(errors);
    }
  };

  const showAllErrors = () => {
    aboutBlurHandler();
    interestsBlurHandler();
  };

  const submitHandler: FormEventHandler = (event) => {
    event.preventDefault();
    if (isValueInterestsValid && isAboutValueValid) {
      sendBecomeMenteeData();
    } else {
      showAllErrors();
    }
  };

  return (
    <DashboardSubpageLayout title="Your Interests">
      <form onSubmit={submitHandler}>
        <SearchSelect
          id="interests"
          label="Fields of Interests"
          value={enteredInterests}
          isValid={isInputInterestsValid}
          onChange={interestsChangeHandler}
          onBlur={interestsBlurHandler}
          icon="💪"
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

        <Button icon="➡️" buttonStyle="primary" type="submit">
          Apply
        </Button>
      </form>
      <div data-testid={"Interests"} />
    </DashboardSubpageLayout>
  );
};

export default MenteeSignup;
