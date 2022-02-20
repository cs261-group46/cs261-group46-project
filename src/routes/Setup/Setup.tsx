import React, { FC } from "react";
import MultiSelect from "../../components/UI/FormInput/MultiSelect/MultiSelect";
import { MultiSelectOptions } from "../../components/UI/FormInput/MultiSelect/MultiSelect.d";
// import styles from "./Setup.module.scss";
import useInput from "../../hooks/UseInput/UseInput";
import { SearchPromise } from "../../components/UI/FormInput/MultiSelect/MultiSelect.d";
import MainLayout from "../../layouts/MainLayout/MainLayout";

interface SetupProps {}

function validateExpertises(_experises: MultiSelectOptions<string>) {
  return true;
}

const Setup: FC<SetupProps> = () => {
  const {
    enteredValue: enteredExpertises,
    isInputValid: isInputExpertisesValid,
    changeHandler: expertisesChangeHandler,
    blurHandler: experiencesBlurHandler,
  } = useInput<MultiSelectOptions<string>>(validateExpertises, []);

  const searchPromise: SearchPromise = (_search) => {
    return new Promise((resolve) =>
      resolve([
        { label: "Tracking", value: "tracking" },
        { label: "Training", value: "training" },
      ])
    );
  };

  return (
    <MainLayout title="Setup">
      <MultiSelect
        id="expertise"
        label="Fields of Expertise"
        value={enteredExpertises}
        isValid={isInputExpertisesValid}
        onChange={expertisesChangeHandler}
        onBlur={experiencesBlurHandler}
        icon="💪"
        searchPromise={searchPromise}
      />
      <div data-testid="Setup"/>
    </MainLayout>
  );
};

export default Setup;