import React, { FC, FormEventHandler, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { index, update } from "../../../api/api";
import Button from "../../../components/UI/Button/Button";
import SearchSelect from "../../../components/UI/FormInput/SearchSelect/SearchSelect";
import {
  SearchSelectOptions,
  SearchPromise,
} from "../../../components/UI/FormInput/SearchSelect/SearchSelect";
import useInput from "../../../hooks/UseInput/UseInput";
import UseVerifyUser from "../../../hooks/UseVerifyUser/UseVerifyUser";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import { TopicWithPriorityType } from "../../../types/Topic";

interface InterestsProps {}

function validateInterests(_experises: SearchSelectOptions<number>) {
  return true;
}

const Interests: FC<InterestsProps> = () => {
  const { mentee_id = null, mentee_topics = [] } = UseVerifyUser<{
    userId: number | null | undefined;
    mentee_id: number | null | undefined;
    mentee_topics: TopicWithPriorityType[] | [];
  }>({
    userDataPolicies: [
      {
        dataPoint: "mentee.id",
        redirectOnFail: "/dashboard",
      },
      {
        dataPoint: "mentee.topics",
      },
    ],
  });

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
      console.log(errors);
      return [];
    }
  };
  const searchPromise: SearchPromise<number> = useCallback((_search) => {
    return new Promise((resolve) => resolve(getTopics(_search)));
  }, []);

  const {
    enteredValue: enteredInterests,
    isInputValid: isInputInterestsValid,
    isValueValid: isValueInterestsValid,
    changeHandler: interestsChangeHandler,
    blurHandler: interestsBlurHandler,
  } = useInput<SearchSelectOptions<number>>([], validateInterests);

  useEffect(() => {
    const topicsSorted = mentee_topics
      ? mentee_topics.sort(
          (topic1: TopicWithPriorityType, topic2: TopicWithPriorityType) =>
            topic1.priority - topic2.priority
        )
      : [];

    const topicsOptions: SearchSelectOptions<number> = topicsSorted.map(
      (topic: TopicWithPriorityType) => ({
        value: topic.topic.id,
        label: topic.topic.name,
      })
    );
    interestsChangeHandler(topicsOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(mentee_topics), interestsChangeHandler]);

  const updateInterests = async () => {
    try {
      const requestBody = {
        interests: enteredInterests.map((interest, index) => ({
          priority: index + 1,
          interest: interest.value,
        })),
      };

      await update({
        resource: "mentees",
        entity: mentee_id as number,
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
