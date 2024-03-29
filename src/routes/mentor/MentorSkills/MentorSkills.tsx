import React, { FC, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { index, update } from "../../../api/api";
import Button from "../../../components/UI/Button/Button";
import SearchSelect from "../../../components/UI/FormInput/SearchSelect/SearchSelect";
import {
  SearchSelectOptions,
  SearchPromise,
} from "../../../components/UI/FormInput/SearchSelect/SearchSelect";
import useInput from "../../../hooks/UseInput/UseInput";
import UseSystemMessage from "../../../hooks/UseSystemMessage/UseSystemMessage";
import UseVerifyUser from "../../../hooks/UseVerifyUser/UseVerifyUser";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import { TopicWithPriorityType } from "../../../types/Topic";

interface MentorSkillsProps {}

function validateInterests(_skills: SearchSelectOptions<number>) {
  return _skills.length > 0;
}

const MentorSkills: FC<MentorSkillsProps> = () => {
  const { mentor_id = null, mentor_topics = [] } = UseVerifyUser<{
    userId: number | null | undefined;
    mentor_id: number | null | undefined;
    mentor_topics: TopicWithPriorityType[] | [];
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
  const showMessage = UseSystemMessage();

  const navigate = useNavigate();

  const getTopics = useCallback(
    async (startsWith: string) => {
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
    },
    [showMessage]
  );

  const searchPromise: SearchPromise<number> = useCallback(
    (_search) => {
      return new Promise((resolve) => resolve(getTopics(_search)));
    },
    [getTopics]
  );

  const {
    enteredValue: enteredSkills,
    isInputValid: isInputSkillsValid,
    isValueValid: isValueSkillsValid,
    changeHandler: skillsChangeHandler,
    blurHandler: skillsBlurHandler,
  } = useInput<SearchSelectOptions<number>>([], validateInterests);

  useEffect(() => {
    const topicsSorted: TopicWithPriorityType[] = mentor_topics
      ? mentor_topics.sort(
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
    skillsChangeHandler(topicsOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(mentor_topics), skillsChangeHandler]);

  const updateSkills = async () => {
    try {
      const requestBody = {
        skills: enteredSkills.map((skill, index) => ({
          priority: index + 1,
          skill: skill.value,
        })),
      };

      await update({
        resource: "mentors",
        entity: mentor_id as number,
        body: requestBody,
      });
      showMessage("success", "Details updated successfully.");
      navigate("/dashboard"); // show message instead
    } catch (errors) {
      showMessage("error", errors);
    }
  };

  const submitHandler = () => {
    if (isValueSkillsValid) {
      updateSkills();
    } else {
      skillsBlurHandler();
    }
  };

  return (
    <DashboardSubpageLayout title="Your Mentorship Areas">
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

      <Button icon="➡️" buttonStyle="primary" onClick={submitHandler}>
        Apply
      </Button>
      <div data-testid={"MentorSkills"} />
    </DashboardSubpageLayout>
    // <div className={styles.MentorSkills} data-testid="MentorSkills">
    //   MentorSkills Component
    // </div>
  );
};

export default MentorSkills;
