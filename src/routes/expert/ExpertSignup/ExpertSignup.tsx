import React, { FC, FormEventHandler, useContext } from "react";

import {
  SearchSelectOptions,
  SearchPromise,
} from "../../../components/UI/FormInput/SearchSelect/SearchSelect";
import useInput from "../../../hooks/UseInput/UseInput";
import Button from "../../../components/UI/Button/Button";
import { useNavigate } from "react-router-dom";
import useVerifyAuth from "../../../hooks/UseVerifyAuth/UseVerifyAuth";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import { index, store } from "../../../api/api";
import SearchSelect from "../../../components/UI/FormInput/SearchSelect/SearchSelect";
import UserDataContext from "../../../store/UserDataContext";
import UseVerifyUser from "../../../hooks/UseVerifyUser/UseVerifyUser";

interface ExpertSignupProps {}

const ExpertSignup: FC<ExpertSignupProps> = () => {
  const { userId = null, expert_id = null } = UseVerifyUser<{
    userId: number | null | undefined;
    expert_id: number | null | undefined;
  }>({
    userDataPolicies: [
      {
        dataPoint: "expert.id",
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

  const showAllErrors = () => {
    skillsBlurHandler();
  };

  const sendBecomeExpertData = async () => {
    try {
      const requestBody = {
        expertises: enteredSkills.map((skill) => skill.value),
        user_id: userId,
      };

      await store({
        resource: "experts",
        body: requestBody,
      });

      navigate("/dashboard"); // show message instead
    } catch (errors) {
      console.log(errors);
    }
  };

  const submitHandler: FormEventHandler = (event) => {
    event.preventDefault();
    if (isSkillsValueValid) {
      sendBecomeExpertData();
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
    <DashboardSubpageLayout title={"Become an Expert"}>
      <form onSubmit={submitHandler}>
        <SearchSelect
          id={"expertises"}
          label={"Areas of Expertises"}
          isValid={isSkillsInputValid}
          value={enteredSkills}
          onChange={skillsChangeHandler}
          onBlur={skillsBlurHandler}
          searchPromise={searchPromise}
        />

        <Button icon="👑" type="submit" buttonStyle={"primary"}>
          Become an Expert
        </Button>
      </form>

      <div data-testid="ExpertSignup" />
    </DashboardSubpageLayout>
  );
};

export default ExpertSignup;
