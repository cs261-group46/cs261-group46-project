import React, { useState } from "react";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import Button from "../../components/UI/Button/Button";
import styles from "./Setup.module.scss";
import useInput from "../../hooks/UseInput/UseInput";
import {
  SearchSelectOption,
  SearchSelectOptions,
  SearchPromise,
} from "../../components/UI/FormInput/SearchSelect/SearchSelect";
import { Link, useNavigate } from "react-router-dom";
import { index, store } from "../../api/api";
import SearchSelect from "../../components/UI/FormInput/SearchSelect/SearchSelect";
import UseVerifyUser from "../../hooks/UseVerifyUser/UseVerifyUser";

const Setup = () => {
  const {
    userId = null,
    // expert_id
  } = UseVerifyUser<{
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

  const navigate = useNavigate();
  const [showExpertise, setShowExpertise] = useState(0);

  const increment = () => {
    setShowExpertise(1);
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

  const {
    enteredValue: enteredExpertises,
    isInputValid: isInputExpertisesValid,
    isValueValid: isValueExpertisesValid,
    changeHandler: expertisesChangeHandler,
    blurHandler: expertisesBlurHandler,
  } = useInput<SearchSelectOptions<number>>(
    [],
    (selectedOptions) => selectedOptions.length > 0
  );

  const storeExpertises = async () => {
    try {
      const requestBody = {
        user_id: userId,
        expertises: enteredExpertises.map(
          (skill: SearchSelectOption<number>) => skill.value
        ),
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

  const submitHandler = () => {
    if (isValueExpertisesValid) {
      storeExpertises();
    } else {
      expertisesBlurHandler();
    }
  };

  return (
    <MainLayout title="Setup">
      <div className={styles.Setup} data-testid={"Setup"}>
        <h1 className={styles.h1}>Would you like to be an expert?</h1>
        <h2 className={styles.h2}>Experts can organise group workshops.</h2>
        {showExpertise === 0 && (
          <>
            <h3 className={styles.h3}>You can change your choice later.</h3>
            <div className={styles.together}>
              <Button icon="✅" onClick={increment} buttonStyle={"primary"}>
                Yes
              </Button>
              <Button icon="❌" href="/dashboard">
                No
              </Button>
            </div>
          </>
        )}
        {showExpertise === 1 && (
          <>
            <SearchSelect
              id="expertise"
              label="Fields of Expertise"
              value={enteredExpertises}
              isValid={isInputExpertisesValid}
              onChange={expertisesChangeHandler}
              onBlur={expertisesBlurHandler}
              icon="💪"
              searchPromise={searchPromise}
            />

            <Link className={styles.a} to="/dashboard">
              No, I would not like to be an expert
            </Link>
            <Button icon="➡️" buttonStyle="primary" onClick={submitHandler}>
              Continue
            </Button>
          </>
        )}
        <Link className={styles.a} to="/dashboard">
          Finish setup later
        </Link>
      </div>
    </MainLayout>
  );
};

export default Setup;
