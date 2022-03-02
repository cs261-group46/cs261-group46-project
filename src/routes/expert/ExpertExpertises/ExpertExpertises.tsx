import React, {
  FC,
  FormEventHandler,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { get, index, update } from "../../../api/api";
import Button from "../../../components/UI/Button/Button";
import SearchSelect from "../../../components/UI/FormInput/SearchSelect/SearchSelect";
import {
  MultiSelectOptions,
  SearchPromise,
} from "../../../components/UI/FormInput/SearchSelect/SearchSelect.d";
import useInput from "../../../hooks/UseInput/UseInput";
import UseVerifyAuth from "../../../hooks/UseVerifyAuth/UseVerifyAuth";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import UserDataContext from "../../../store/UserDataContext";

interface ExpertExpertisesProps {}

function validateInterests(_experises: MultiSelectOptions<number>) {
  return true;
}

const ExpertExpertises: FC<ExpertExpertisesProps> = () => {
  UseVerifyAuth();
  const navigate = useNavigate();

  const userDataCtx = useContext(UserDataContext);
  if (!userDataCtx.expertId) navigate("/dashboard");

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
      return options;
    } catch (errors) {
      console.log(errors);
      return [];
    }
  };
  // return data;

  const searchPromise: SearchPromise<number> = (_search) => {
    return new Promise((resolve) => resolve(getTopics(_search)));
  };

  const {
    enteredValue: enteredExpertises,
    isInputValid: isInputExpertisesValid,
    isValueValid: isValueExpertisesValid,
    changeHandler: expertisesChangeHandler,
    blurHandler: expertisesBlurHandler,
  } = useInput<MultiSelectOptions<number>>([], validateInterests);

  const getExpertises = useCallback(async () => {
    try {
      const data = await get({
        resource: "experts",
        entity: userDataCtx.expertId as number,
        args: {
          fields: "topics",
        },
      });
      const topicsOptions: MultiSelectOptions<number> = data.expert.topics.map(
        (topic: { id: number; name: string }) => ({
          value: topic.id,
          label: topic.name,
        })
      );
      expertisesChangeHandler(topicsOptions);
    } catch (errors) {
      console.log(errors);
    }
  }, [expertisesChangeHandler, userDataCtx.expertId]);

  useEffect(() => {
    getExpertises();
  }, [getExpertises]);

  const updateExpertises = async () => {
    try {
      const requestBody = {
        expertises: enteredExpertises.map((expertise) => expertise.value),
      };
      await update({
        resource: "experts",
        entity: userDataCtx.expertId as number,
        body: requestBody,
      });
      navigate("/dashboard"); // show message instead
    } catch (errors) {
      console.log(errors);
    }
  };

  const submitHandler: FormEventHandler = (event) => {
    event.preventDefault();
    if (isValueExpertisesValid) {
      updateExpertises();
    } else {
      expertisesBlurHandler();
    }
  };

  return (
    <DashboardSubpageLayout title="Your Fields of Expertise">
      <form onSubmit={submitHandler}>
        <SearchSelect
          id="expertises"
          label="Fields of Expertise"
          value={enteredExpertises}
          isValid={isInputExpertisesValid}
          onChange={expertisesChangeHandler}
          onBlur={expertisesBlurHandler}
          icon="💪"
          searchPromise={searchPromise}
        />

        <Button icon="➡️" buttonStyle="primary" type="submit">
          Apply
        </Button>
      </form>
    </DashboardSubpageLayout>
    // <div className={styles.ExpertExpertises} data-testid="ExpertExpertises">
    //   ExpertExpertises Component
    // </div>
  );
};

export default ExpertExpertises;
