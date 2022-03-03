import React, { FC, FormEventHandler } from "react";
import styles from "./CreateMeeting.module.scss";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import SearchSelect from "../../components/UI/FormInput/SearchSelect/SearchSelect";
import {
  MultiSelectOptions,
  SearchPromise,
} from "../../components/UI/FormInput/SearchSelect/SearchSelect.d";
import useInput from "../../hooks/UseInput/UseInput";
import DatePicker from "../../components/UI/FormInput/DatePicker/DatePicker";
import HoursInput, {
  Range,
} from "../../components/UI/FormInput/HoursInput/HoursInput";
import BigTextInput from "../../components/UI/FormInput/BigTextInput/BigTextInput";
import TextInput from "../../components/UI/FormInput/TextInput/TextInput";
import Button from "../../components/UI/Button/Button";
import UseVerifyAuth from "../../hooks/UseVerifyAuth/UseVerifyAuth";

interface CreateMeetingProps {}

interface Room {
  id: number;
  label: string;
}

const CreateMeeting: FC<CreateMeetingProps> = () => {
  UseVerifyAuth();

  const {
    enteredValue: room,
    changeHandler: roomChangeHandler,
    blurHandler: roomBlurHandler,
    isInputValid: roomInputValid,
    isValueValid: roomValueValid,
  } = useInput<MultiSelectOptions<Room>>([], (value) => value.length > 0);

  const {
    enteredValue: invite,
    changeHandler: inviteChangeHandler,
    blurHandler: inviteBlurHandler,
  } = useInput<string>("");

  const {
    enteredValue: date,
    changeHandler: dateChangeHandler,
    blurHandler: dateBlurHandler,
  } = useInput<Date>(new Date());

  const {
    enteredValue: time,
    changeHandler: timeChangeHandler,
    blurHandler: timeBlurHandler,
    isInputValid: timeInputValid,
    isValueValid: timeValueValid,
  } = useInput<Range[]>([]);

  const {
    enteredValue: description,
    changeHandler: descriptionChangeHandler,
    blurHandler: descriptionBlurHandler,
  } = useInput<string>("");

  const searchPromise: SearchPromise<Room> = async (search) => {
    const result = await fetch(`/api/meetings/rooms?startwith=${search}`);

    if (result.ok) {
      const rooms: { result: Room[] } = await result.json();

      return rooms.result.map((room) => ({ label: room.label, value: room }));
    }

    // else if bad, do nothing
    return [];
  };

  function showErrors() {
    // this will also make errors show if needed
    roomBlurHandler();
    timeBlurHandler();
  }

  const submitHandler: FormEventHandler = (event) => {
    event.preventDefault();
    if (roomValueValid && timeValueValid) {
      // send off this event to the backend
    } else {
      showErrors();
    }
  };

  return (
    <MainLayout title={"Create a Meeting"}>
      <form
        className={styles.CreateMeeting}
        data-testid="CreateMeeting"
        onSubmit={submitHandler}
      >
        <SearchSelect
          id={"room"}
          label={"Room"}
          isValid={roomInputValid}
          value={room}
          onChange={roomChangeHandler}
          onBlur={roomBlurHandler}
          searchPromise={searchPromise}
          limit={1}
        />

        <TextInput
          id={"invite"}
          label={"Alternative Invite URL"}
          placeholder={"e.g. a Virtual Meeting"}
          value={invite}
          isValid={true}
          onChange={inviteChangeHandler}
          onBlur={inviteBlurHandler}
        />

        <DatePicker
          id={"date"}
          label={"Date"}
          value={date}
          isValid={true}
          onChange={dateChangeHandler}
          onBlur={dateBlurHandler}
        />

        <HoursInput
          label={"Time"}
          isValid={timeInputValid}
          value={time}
          onChange={timeChangeHandler}
          onBlur={timeBlurHandler}
          width={"150px"}
        />

        <BigTextInput
          id={"description"}
          label={"Note to Mentor"}
          placeholder={"Include what you'd like to talk about in the meeting"}
          value={description}
          isValid={true}
          onChange={descriptionChangeHandler}
          onBlur={descriptionBlurHandler}
        />

        <Button icon="👑" type={"submit"} buttonStyle={"primary"}>
          Register
        </Button>
      </form>
    </MainLayout>
  );
};

export default CreateMeeting;
