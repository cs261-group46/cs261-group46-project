import React, { FC, FormEventHandler } from "react";
import Button from "../../../components/UI/Button/Button";
import MultiSelect from "../../../components/UI/FormInput/MultiSelect/MultiSelect";
import {
  MultiSelectOptions,
  SearchPromise,
} from "../../../components/UI/FormInput/MultiSelect/MultiSelect.d";
import useInput from "../../../hooks/UseInput/UseInput";
import UseVerifyAuth from "../../../hooks/UseVerifyAuth/UseVerifyAuth";
import MainLayout from "../../../layouts/MainLayout/MainLayout";
import styles from "./YourInterests.module.scss";

interface YourInterestsProps {}

function validateInterests(_experises: MultiSelectOptions<number>) {
  return true;
}

const YourInterests: FC<YourInterestsProps> = () => {
  UseVerifyAuth();

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
    changeHandler: interestsChangeHandler,
    blurHandler: interestsBlurHandler,
  } = useInput<MultiSelectOptions<number>>([], validateInterests);

  const sendInterestsData = async () => {
    const body = {
      interests: enteredInterests.map((interest) => interest.value),
    };

    const response = await fetch("/api/WHATROUTE", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(body), // body data type must match "Content-Type" header
    });

    const returnedData = await response.json();
    // if (returnedData.successful) navigate("/dashboard");
  };

  const submitHandler: FormEventHandler = (event) => {
    event.preventDefault();
    if (isInputInterestsValid) {
      sendInterestsData();
    }
  };

  return (
    <MainLayout title="Your Interests">
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
          Add Interests
        </Button>
      </form>
    </MainLayout>
    // <div className={styles.YourInterests} data-testid="YourInterests">
    //   YourInterests Component
    // </div>
  );
};

export default YourInterests;
