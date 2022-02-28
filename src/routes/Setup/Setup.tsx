import React, { FormEventHandler, useState } from "react";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import Button from "../../components/UI/Button/Button";
import styles from "./Setup.module.scss";
import MultiSelect from "../../components/UI/FormInput/MultiSelect/MultiSelect";
import useInput from "../../hooks/UseInput/UseInput";
import {
  SelectOption,
  SelectOptions,
} from "../../components/UI/FormInput/Select/Select.d";
import {
  MultiSelectOptions,
  SearchPromise,
} from "../../components/UI/FormInput/MultiSelect/MultiSelect.d";
import { Link, useNavigate } from "react-router-dom";

import UseVerifyAuth from "../../hooks/UseVerifyAuth/UseVerifyAuth";

const Setup = () => {
  UseVerifyAuth();
  const navigate = useNavigate();
  const [showExpertise, setShowExpertise] = useState(0);

  const increment = () => {
    setShowExpertise(1);
  };

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
    enteredValue: enteredExpertises,
    isInputValid: isInputExpertisesValid,
    isValueValid: isValueExpertisesValid,
    changeHandler: expertisesChangeHandler,
    blurHandler: expertisesBlurHandler,
  } = useInput<MultiSelectOptions<number>>(
    [],
    (selectedOptions) => selectedOptions.length > 0
  );

  const sendExpertisesData = async () => {
    const body = {
      expertises: enteredExpertises.map((expertise) => expertise.value),
    };

    const response = await fetch("/api/experts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(body), // body data type must match "Content-Type" header
    });

    const returnedData = await response.json();
    if (returnedData.successful) navigate("/dashboard");
  };

  const submitHandler: FormEventHandler = (event) => {
    event.preventDefault();
    if (isValueExpertisesValid) {
      sendExpertisesData();
    } else {
      expertisesBlurHandler();
    }
  };
  return (
    <MainLayout title="Setup">
      <div className={styles.Setup}>
        <h1>Would you like to be an expert?</h1>
        <h2>Experts can organise group workshops.</h2>
        {showExpertise === 0 && (
          <>
            <h3>You can change your choice later.</h3>
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
          <form onSubmit={submitHandler}>
            <MultiSelect
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
            <Button icon="➡️" buttonStyle="primary" type="submit">
              Continue
            </Button>
          </form>
        )}
        <Link className={styles.a} to="/dashboard">
          Finish setup later
        </Link>
      </div>
    </MainLayout>
  );
};

export default Setup;

// import React, { FC } from "react";
// import MultiSelect from "../../components/UI/FormInput/MultiSelect/MultiSelect";
// import { MultiSelectOptions } from "../../components/UI/FormInput/MultiSelect/MultiSelect.d";
// // import styles from "./Setup.module.scss";
// import useInput from "../../hooks/UseInput/UseInput";
// import { SearchPromise } from "../../components/UI/FormInput/MultiSelect/MultiSelect.d";
// import MainLayout from "../../layouts/MainLayout/MainLayout";
// import UseVerifyAuth from "../../hooks/UseVerifyAuth/UseVerifyAuth";

// interface SetupProps {}

// function validateExpertises(_experises: MultiSelectOptions<string>) {
//   return true;
// }

// const Setup: FC<SetupProps> = () => {
//   UseVerifyAuth(0);
//   const {
//     enteredValue: enteredExpertises,
//     isInputValid: isInputExpertisesValid,
//     changeHandler: expertisesChangeHandler,
//     blurHandler: experiencesBlurHandler,
//   } = useInput<MultiSelectOptions<string>>(validateExpertises, []);

//   const searchPromise: SearchPromise = (_search) => {
//     return new Promise((resolve) =>
//       resolve([
//         { label: "Tracking", value: "tracking" },
//         { label: "Training", value: "training" },
//       ])
//     );
//   };

//   return (
//     <MainLayout title="Setup">
//       <MultiSelect
//         id="expertise"
//         label="Fields of Expertise"
//         value={enteredExpertises}
//         isValid={isInputExpertisesValid}
//         onChange={expertisesChangeHandler}
//         onBlur={experiencesBlurHandler}
//         icon="💪"
//         searchPromise={searchPromise}
//       />
//       <div data-testid="Setup" />
//     </MainLayout>
//   );
// };

// export default Setup;
