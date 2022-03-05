import React, { FC, FormEventHandler, useContext } from "react";

import {
  MultiSelectOptions,
  SearchPromise,
} from "../../../components/UI/FormInput/SearchSelect/SearchSelect.d";
import useInput from "../../../hooks/UseInput/UseInput";
import Button from "../../../components/UI/Button/Button";
import { useNavigate } from "react-router-dom";
import useVerifyAuth from "../../../hooks/UseVerifyAuth/UseVerifyAuth";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import { index, store } from "../../../api/api";
import SearchSelect from "../../../components/UI/FormInput/SearchSelect/SearchSelect";
import UserDataContext from "../../../store/UserDataContext";

interface ExpertSignupProps {}

const ExpertSignup: FC<ExpertSignupProps> = () => {
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

  const showAllErrors = () => {
    skillsBlurHandler();
  };

  const sendBecomeExpertData = async () => {
    try {
      const requestBody = {
        expertises: enteredSkills.map((skill) => skill.value),
      };

      await store({
        resource: "experts",
        body: requestBody,
      });

      userDataCtx.updateExpertId();
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
      const options: MultiSelectOptions<number> = data.topics.map(
        ({ label, id }: { label: string; id: number }) => ({
          label,
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
