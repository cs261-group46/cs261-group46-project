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
import { TopicWithPriorityType } from "../../../types/Topic";

interface MentorSkillsProps {}

function validateInterests(_experises: MultiSelectOptions<number>) {
  return true;
}

const MentorSkills: FC<MentorSkillsProps> = () => {
  const userDataCtx = useContext(UserDataContext);
  UseVerifyAuth();
  const navigate = useNavigate();

  if (!userDataCtx.mentorId) navigate("/dashboard");

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
  // return data;

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

  const getSkills = useCallback(async () => {
    try {
      const data = await get({
        resource: "mentors",
        entity: userDataCtx.mentorId as number,
        args: {
          fields: "topics",
        },
      });

      const topics = data.mentor.topics.sort(
        (topic1: TopicWithPriorityType, topic2: TopicWithPriorityType) =>
          topic1.priority - topic2.priority
      );

      const topicsOptions: MultiSelectOptions<number> = topics.map(
        (topic: TopicWithPriorityType) => ({
          value: topic.topic.id,
          label: topic.topic.name,
        })
      );
      skillsChangeHandler(topicsOptions);
    } catch (errors) {
      console.log(errors);
    }
  }, [skillsChangeHandler, userDataCtx.mentorId]);

  useEffect(() => {
    getSkills();
  }, [getSkills]);

  const updateSkills = async () => {
    try {
      const requestBody = {
        skills: enteredSkills.map((skill, index) => ({
          priority: index,
          skill: skill.value,
        })),
      };
      console.log(enteredSkills);

      await update({
        resource: "mentors",
        entity: userDataCtx.mentorId as number,
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
