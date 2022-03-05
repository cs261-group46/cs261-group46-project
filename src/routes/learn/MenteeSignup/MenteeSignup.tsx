import React, { FC, FormEventHandler, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { index, store } from "../../../api/api";
import Button from "../../../components/UI/Button/Button";
import BigTextInput from "../../../components/UI/FormInput/BigTextInput/BigTextInput";
import SearchSelect from "../../../components/UI/FormInput/SearchSelect/SearchSelect";
import {
  MultiSelectOptions,
  SearchPromise,
} from "../../../components/UI/FormInput/SearchSelect/SearchSelect.d";
import useInput from "../../../hooks/UseInput/UseInput";
import UseVerifyAuth from "../../../hooks/UseVerifyAuth/UseVerifyAuth";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import UserDataContext from "../../../store/UserDataContext";

interface MenteeSignupProps {}

function validateInterests(_experises: MultiSelectOptions<number>) {
  return true;
}

const MenteeSignup: FC<MenteeSignupProps> = () => {
  UseVerifyAuth();
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
    enteredValue: enteredInterests,
    isInputValid: isInputInterestsValid,
    isValueValid: isValueInterestsValid,
    changeHandler: interestsChangeHandler,
    blurHandler: interestsBlurHandler,
  } = useInput<MultiSelectOptions<number>>([], validateInterests);

  const {
    isInputValid: isAboutInputValid,
    isValueValid: isAboutValueValid,
    changeHandler: aboutChangeHandler,
    blurHandler: aboutBlurHandler,
    enteredValue: enteredAbout,
  } = useInput<string>("", (about) => about.length > 0 && about.length < 1000);

  // const getInterests = useCallback(async () => {
  //   try {
  //     console.log(userDataCtx.userId);

  //     const data = await get({
  //       resource: "users",
  //       entity: userDataCtx.userId as number,
  //       args: {
  //         fields: ["mentee.topics"],
  //       },
  //     });

  //     const topics = data.user.topics.sort(
  //       (topic1: TopicWithPriorityType, topic2: TopicWithPriorityType) =>
  //         topic1.priority - topic2.priority
  //     );

  //     const topicsOptions: MultiSelectOptions<number> = topics.map(
  //       (topic: TopicWithPriorityType) => ({
  //         value: topic.topic.id,
  //         label: topic.topic.name,
  //       })
  //     );
  //     interestsChangeHandler(topicsOptions);
  //   } catch (errors) {
  //     console.log(errors);
  //   }
  // }, [interestsChangeHandler, userDataCtx.userId]);

  // useEffect(() => {
  //   getInterests();
  // }, [getInterests]);

  const sendBecomeMenteeData = async () => {
    try {
      const requestBody = {
        skills: enteredInterests.map((interest, index) => ({
          priority: index,
          skill: interest.value,
        })),
        about: enteredAbout,
      };

      await store({
        resource: "mentees",
        body: requestBody,
      });

      userDataCtx.updateMenteeId();
      navigate("/dashboard"); // show message instead
    } catch (errors) {
      console.log(errors);
    }
  };

  // const storeMentee = async () => {
  //   try {
  //     const requestBody = {
  //       interests: enteredInterests.map((interest, index) => ({
  //         priority: index,
  //         interest: interest.value,
  //       })),
  //     };
  //     console.log(requestBody);
  //     await update({
  //       resource: "users",
  //       entity: userDataCtx.userId as number,
  //       body: requestBody,
  //     });
  //     // navigate("/dashboard"); // show message instead
  //   } catch (errors) {
  //     console.log(errors);
  //   }
  // };

  const showAllErrors = () => {
    aboutBlurHandler();
    interestsBlurHandler();
  };

  const submitHandler: FormEventHandler = (event) => {
    event.preventDefault();
    if (isValueInterestsValid && isAboutValueValid) {
      sendBecomeMenteeData();
    } else {
      showAllErrors();
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

        <BigTextInput
          id={"profile"}
          label={"About me"}
          placeholder={"I can play Electric Guitar"}
          value={enteredAbout}
          isValid={isAboutInputValid}
          onChange={aboutChangeHandler}
          onBlur={aboutBlurHandler}
        />

        <Button icon="➡️" buttonStyle="primary" type="submit">
          Apply
        </Button>
      </form>
      <div data-testid={"Interests"} />
    </DashboardSubpageLayout>
  );
};

export default MenteeSignup;
