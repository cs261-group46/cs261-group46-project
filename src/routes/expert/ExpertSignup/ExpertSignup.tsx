import React, { FC, FormEventHandler, useCallback, useContext } from "react";

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
import UseSystemMessage from "../../../hooks/UseSystemMessage/UseSystemMessage";

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

  const showMessage = UseSystemMessage();

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

      showMessage("success", "Successfully signed up as an expert.");
      navigate("/dashboard"); // show message instead
    } catch (errors) {
      showMessage("error", errors);
    }
  };

  const submitHandler = () => {
    if (isSkillsValueValid) {
      sendBecomeExpertData();
    } else {
      showAllErrors();
    }
  };

  const getTopics = useCallback(
    async (startsWith: string) => {
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
        showMessage("error", errors);
        return [];
      }
    },
    [showMessage]
  );

  const searchPromise: SearchPromise<number> = useCallback(
    (_search) => {
      return new Promise((resolve) => resolve(getTopics(_search)));
    },
    [getTopics]
  );

  return (
    <DashboardSubpageLayout title={"Become an Expert"}>
      <SearchSelect
        id={"expertises"}
        label={"Areas of Expertises"}
        isValid={isSkillsInputValid}
        value={enteredSkills}
        onChange={skillsChangeHandler}
        onBlur={skillsBlurHandler}
        searchPromise={searchPromise}
      />

      <Button icon="👑" onClick={submitHandler} buttonStyle={"primary"}>
        Become an Expert
      </Button>

      <div data-testid="ExpertSignup" />
    </DashboardSubpageLayout>
  );
};

export default ExpertSignup;
