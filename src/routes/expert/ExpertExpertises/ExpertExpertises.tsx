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
import SearchSelect, {
  SearchSelectOption,
} from "../../../components/UI/FormInput/SearchSelect/SearchSelect";
import {
  SearchSelectOptions,
  SearchPromise,
} from "../../../components/UI/FormInput/SearchSelect/SearchSelect";
import useInput from "../../../hooks/UseInput/UseInput";
import UseSystemMessage from "../../../hooks/UseSystemMessage/UseSystemMessage";
import UseVerifyAuth from "../../../hooks/UseVerifyAuth/UseVerifyAuth";
import UseVerifyUser from "../../../hooks/UseVerifyUser/UseVerifyUser";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import UserDataContext from "../../../store/UserDataContext";
import { TopicType } from "../../../types/Topic";

interface ExpertExpertisesProps {}

function validateInterests(_expertises: SearchSelectOptions<number>) {
  return _expertises.length > 0;
}

const ExpertExpertises: FC<ExpertExpertisesProps> = () => {
  const { expert_id = null, expert_topics = [] } = UseVerifyUser<{
    expert_id: number | null | undefined;
    expert_topics: TopicType[] | null | undefined;
  }>({
    userDataPolicies: [
      {
        dataPoint: "expert.id",
        redirectOnFail: "/dashboard",
      },
      {
        dataPoint: "expert.topics",
      },
    ],
  });

  const showMessage = UseSystemMessage();

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
      showMessage("error", errors);
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
  } = useInput<SearchSelectOptions<number>>([], validateInterests);

  useEffect(() => {
    const topicsOptions: SearchSelectOptions<number> = expert_topics
      ? expert_topics.map((topic: { id: number; name: string }) => ({
          value: topic.id,
          label: topic.name,
        }))
      : [];
    expertisesChangeHandler(topicsOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(expert_topics), expertisesChangeHandler]);

  const updateExpertises = async () => {
    try {
      const requestBody = {
        expertises: enteredExpertises.map(
          (expertise: SearchSelectOption<number>) => expertise.value
        ),
      };
      await update({
        resource: "experts",
        entity: expert_id as number,
        body: requestBody,
      });
      showMessage("success", "Details updated successfully.");
      navigate("/dashboard"); // show message instead
    } catch (errors) {
      showMessage("error", errors);
    }
  };

  const submitHandler = () => {
    if (isValueExpertisesValid) {
      updateExpertises();
    } else {
      expertisesBlurHandler();
    }
  };

  return (
    <DashboardSubpageLayout title="Your Fields of Expertise">
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

      <Button icon="➡️" buttonStyle="primary" onClick={submitHandler}>
        Apply
      </Button>
      <div data-testid={"ExpertExpertises"} />
    </DashboardSubpageLayout>
    // <div className={styles.ExpertExpertises} data-testid="ExpertExpertises">
    //   ExpertExpertises Component
    // </div>
  );
};

export default ExpertExpertises;
