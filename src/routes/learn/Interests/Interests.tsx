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
import styles from "./Interests.module.scss";

interface InterestsProps {}

function validateInterests(_experises: MultiSelectOptions<number>) {
  return true;
}

const Interests: FC<InterestsProps> = () => {
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
    enteredValue: enteredInterests,
    isInputValid: isInputInterestsValid,
    isValueValid: isValueInterestsValid,
    changeHandler: interestsChangeHandler,
    blurHandler: interestsBlurHandler,
  } = useInput<MultiSelectOptions<number>>([], validateInterests);

  const fetchInterests = useCallback(async () => {
    const response = await fetch("/api/users?fields=topics");
    const returnedData = await response.json();

    const topicsOptions: MultiSelectOptions<number> =
      returnedData.data.user.topics.map(
        (topic: { id: number; name: string }) => ({
          value: topic.id,
          label: topic.name,
        })
      );

    console.log(topicsOptions);

    interestsChangeHandler(topicsOptions);
  }, [interestsChangeHandler]);

  useEffect(() => {
    fetchInterests();
  }, [fetchInterests]);

  const sendInterestsData = async () => {
    const body = {
      interests: enteredInterests.map((interest) => interest.value),
    };

    const response = await fetch("/api/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(body), // body data type must match "Content-Type" header
    });

    // const returnedData = await response.json();
    if (response.ok) navigate("/dashboard");
  };

  const submitHandler: FormEventHandler = (event) => {
    event.preventDefault();
    if (isValueInterestsValid) {
      sendInterestsData();
    } else {
      interestsBlurHandler();
    }
  };

  return (
    <DashboardSubpageLayout title="Your Interests">
      <form onSubmit={submitHandler}>
        <MultiSelect
          id="interests"
          label="Fields of Interests"
          value={enteredInterests}
          isValid={isInputInterestsValid}
          onChange={interestsChangeHandler}
          onBlur={interestsBlurHandler}
          icon="💪"
          searchPromise={searchPromise}
        />

        <Button icon="➡️" buttonStyle="primary" type="submit">
          Apply
        </Button>
      </form>
    </DashboardSubpageLayout>
    // <div className={styles.Interests} data-testid="Interests">
    //   Interests Component
    // </div>
  );
};

export default Interests;
