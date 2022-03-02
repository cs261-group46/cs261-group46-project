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

interface InterestsProps {}

function validateInterests(_experises: MultiSelectOptions<number>) {
  return true;
}

const Interests: FC<InterestsProps> = () => {
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

  const getInterests = useCallback(async () => {
    try {
      const data = await get({
        resource: "users",
        entity: userDataCtx.userId as number,
        args: {
          fields: ["topics"],
        },
      });
      const topicsOptions: MultiSelectOptions<number> = data.user.topics.map(
        (topic: { id: number; name: string }) => ({
          value: topic.id,
          label: topic.name,
        })
      );
      interestsChangeHandler(topicsOptions);
    } catch (errors) {
      console.log(errors);
    }
  }, [interestsChangeHandler]);

  useEffect(() => {
    getInterests();
  }, [getInterests]);

  const updateInterests = async () => {
    try {
      const requestBody = {
        interests: enteredInterests.map((interest) => interest.value),
      };
      await update({
        resource: "users",
        entity: userDataCtx.userId as number,
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
