import React, {
  FC,
  FormEventHandler,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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
import UseVerifyUser from "../../../hooks/UseVerifyUser/UseVerifyUser";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import UserDataContext from "../../../store/UserDataContext";
import { TopicWithPriorityType } from "../../../types/Topic";

interface MentorSkillsProps {}

function validateInterests(_experises: MultiSelectOptions<number>) {
  return true;
}

const MentorSkills: FC<MentorSkillsProps> = () => {
  const { mentor_id = null, mentor_topics = [] } = UseVerifyUser<{
    userId: number | null | undefined;
    mentor_id: number | null | undefined;
    mentor_topics: TopicWithPriorityType[] | null | undefined;
  }>({
    userDataPolicies: [
      {
        dataPoint: "mentor.id",
        redirectOnFail: "/dashboard",
      },
      {
        dataPoint: "mentor.topics",
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

      const options: MultiSelectOptions<number> = data.topics.map(
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
    enteredValue: enteredSkills,
    isInputValid: isInputSkillsValid,
    isValueValid: isValueSkillsValid,
    changeHandler: skillsChangeHandler,
    blurHandler: skillsBlurHandler,
  } = useInput<MultiSelectOptions<number>>([], validateInterests);

  const topics = useMemo(
    () =>
      mentor_topics
        ? mentor_topics.sort(
            (topic1: TopicWithPriorityType, topic2: TopicWithPriorityType) =>
              topic1.priority - topic2.priority
          )
        : [],
    [JSON.stringify(mentor_topics)]
  );

  useEffect(() => {
    const topicsOptions: MultiSelectOptions<number> = topics.map(
      (topic: TopicWithPriorityType) => ({
        value: topic.topic.id,
        label: topic.topic.name,
      })
    );
    skillsChangeHandler(topicsOptions);
  }, [skillsChangeHandler, topics]);

  const updateSkills = async () => {
    try {
      const requestBody = {
        skills: enteredSkills.map((skill, index) => ({
          priority: index,
          skill: skill.value,
        })),
      };

      await update({
        resource: "mentors",
        entity: mentor_id as number,
        body: requestBody,
      });
      navigate("/dashboard"); // show message instead
    } catch (errors) {
      console.log(errors);
    }
  };

  const submitHandler: FormEventHandler = (event) => {
    event.preventDefault();
    if (isValueSkillsValid) {
      updateSkills();
    } else {
      skillsBlurHandler();
    }
  };

  return (
    <DashboardSubpageLayout title="Your Mentorship Areas">
      <form onSubmit={submitHandler}>
        <SearchSelect
          id="skills"
          label="Areas of Mentorship"
          value={enteredSkills}
          isValid={isInputSkillsValid}
          onChange={skillsChangeHandler}
          onBlur={skillsBlurHandler}
          icon="💪"
          searchPromise={searchPromise}
          type={"draggable"}
        />

        <Button icon="➡️" buttonStyle="primary" type="submit">
          Apply
        </Button>
      </form>
      <div data-testid={"MentorSkills"} />
    </DashboardSubpageLayout>
    // <div className={styles.MentorSkills} data-testid="MentorSkills">
    //   MentorSkills Component
    // </div>
  );
};

export default MentorSkills;
