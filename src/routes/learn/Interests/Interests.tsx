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
  SearchSelectOptions,
  SearchPromise,
} from "../../../components/UI/FormInput/SearchSelect/SearchSelect";
import useInput from "../../../hooks/UseInput/UseInput";
import UseVerifyAuth from "../../../hooks/UseVerifyAuth/UseVerifyAuth";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import UserDataContext from "../../../store/UserDataContext";
import { TopicWithPriorityType } from "../../../types/Topic";

interface InterestsProps {}

function validateInterests(_experises: SearchSelectOptions<number>) {
  return true;
}

const Interests: FC<InterestsProps> = () => {
  const navigate = useNavigate();
  const userDataCtx = useContext(UserDataContext);

  const getTopics = async (startsWith: string) => {
    try {
      const data = await index({
        resource: "topics",
        args: {
          startswith: startsWith,
        },
      });
      const options: SearchSelectOptions<number> = data.topics.map(
        ({ label, id }: { label: string; id: number }) => ({ label, value: id })
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
    enteredValue: enteredInterests,
    isInputValid: isInputInterestsValid,
    isValueValid: isValueInterestsValid,
    changeHandler: interestsChangeHandler,
    blurHandler: interestsBlurHandler,
  } = useInput<SearchSelectOptions<number>>([], validateInterests);

  const getInterests = useCallback(async () => {
    try {
      console.log(userDataCtx.userId);

      const data = await get({
        resource: "users",
        entity: userDataCtx.userId as number,
        args: {
          fields: ["mentee.topics"],
        },
      });

      console.log(data);

      const topics = data.user.mentee.topics.sort(
        (topic1: TopicWithPriorityType, topic2: TopicWithPriorityType) =>
          topic1.priority - topic2.priority
      );

      const topicsOptions: SearchSelectOptions<number> = topics.map(
        (topic: TopicWithPriorityType) => ({
          value: topic.topic.id,
          label: topic.topic.name,
        })
      );
      interestsChangeHandler(topicsOptions);
    } catch (errors) {
      console.log(errors);
    }
  }, [interestsChangeHandler, userDataCtx.userId]);

  useEffect(() => {
    getInterests();
  }, [getInterests]);

  const updateInterests = async () => {
    try {
      const requestBody = {
        interests: enteredInterests.map((interest, index) => ({
          priority: index,
          interest: interest.value,
        })),
      };
      console.log(requestBody);
      await update({
        resource: "mentees",
        entity: userDataCtx.menteeId as number,
        body: requestBody,
      });
      navigate("/dashboard"); // show message instead
    } catch (errors) {
      console.log(errors);
    }
  };

  const submitHandler: FormEventHandler = (event) => {
    event.preventDefault();
    if (isValueInterestsValid) {
      updateInterests();
    } else {
      interestsBlurHandler();
    }
  };

  return (
    <DashboardSubpageLayout title="Your Interests">
      <form onSubmit={submitHandler}>
        <SearchSelect
          id="interests"
          label="Fields of Interests"
          value={enteredInterests}
          isValid={isInputInterestsValid}
          onChange={interestsChangeHandler}
          onBlur={interestsBlurHandler}
          icon="💪"
          searchPromise={searchPromise}
          type={"draggable"}
        />

        <Button icon="➡️" buttonStyle="primary" type="submit">
          Apply
        </Button>
      </form>
      <div data-testid={"Interests"} />
    </DashboardSubpageLayout>
    // <div className={styles.Interests} data-testid="Interests">
    //   Interests Component
    // </div>
  );
};

export default Interests;
