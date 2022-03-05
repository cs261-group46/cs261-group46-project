import React, {
  FC,
  FormEventHandler,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import styles from "./CreateWorkshop.module.scss";
import MainLayout from "../../../layouts/MainLayout/MainLayout";
import SearchSelect from "../../../components/UI/FormInput/SearchSelect/SearchSelect";
import {
  MultiSelectOptions,
  SearchPromise,
} from "../../../components/UI/FormInput/SearchSelect/SearchSelect.d";
import useInput from "../../../hooks/UseInput/UseInput";
import DatePicker from "../../../components/UI/FormInput/DatePicker/DatePicker";
import HoursInput, {
  Range,
} from "../../../components/UI/FormInput/HoursInput/HoursInput";
import BigTextInput from "../../../components/UI/FormInput/BigTextInput/BigTextInput";
import TextInput from "../../../components/UI/FormInput/TextInput/TextInput";
import Select from "../../../components/UI/FormInput/Select/Select";
import { SelectOption } from "../../../components/UI/FormInput/Select/Select.d";
import Button from "../../../components/UI/Button/Button";
import UseVerifyAuth from "../../../hooks/UseVerifyAuth/UseVerifyAuth";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import UserDataContext from "../../../store/UserDataContext";
import { useNavigate } from "react-router-dom";
import { type } from "os";
import { index, store } from "../../../api/api";
import { Room } from "../../../types/Room";
import UseVerifyUserData from "../../../hooks/UseVerifyUserData/UseVerifyUserData";
import UseVerifyUser from "../../../hooks/UseVerifyUser/UseVerifyUser";

interface CreateWorkshopProps {}

type Verifier = {
  userId: number | null | undefined;
  expert_id: number | null | undefined;
};

const CreateWorkshop: FC<CreateWorkshopProps> = () => {
  const { userId = null } = UseVerifyUser<Verifier>({
    userDataPolicies: [
      {
        dataPoint: "expert.id",
        redirectOnFail: "/dashboard",
      },
    ],
  });

  const {
    enteredValue: title,
    isInputValid: titleInputValid,
    isValueValid: titleValueValid,
    changeHandler: titleChangeHandler,
    blurHandler: titleBlurHandler,
  } = useInput<string>("");

  const {
    enteredValue: room,
    changeHandler: roomChangeHandler,
    blurHandler: roomBlurHandler,
    isInputValid: roomInputValid,
    isValueValid: roomValueValid,
  } = useInput<MultiSelectOptions<Room>>([], (value) => value.length > 0);

  const {
    enteredValue: invites,
    changeHandler: invitesChangeHandler,
    blurHandler: invitesBlurHandler,
    isInputValid: invitesInputValid,
    isValueValid: invitesValueValid,
  } = useInput<MultiSelectOptions<{ email: string; id: number }>>(
    [],
    (value) => value.length > 0
  );

  const {
    enteredValue: link,
    changeHandler: linkChangeHandler,
    blurHandler: linkBlurHandler,
  } = useInput<string>("");

  const {
    enteredValue: date,
    isInputValid: dateInputValid,
    isValueValid: dateValueValid,
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

  const {
    enteredValue: capacity,
    changeHandler: capacityChangeHandler,
    isInputValid: capacityInputValid,
    isValueValid: capacityValueValid,
    blurHandler: capacityBlurHandler,
  } = useInput<number>(0, (value) => value > 0);

  const {
    enteredValue: visibility,
    isInputValid: visibilityValueValid,
    isInputValid: visibilityInputValid,
    changeHandler: visibilityChangeHandler,
    blurHandler: visibilityBlurHandler,
  } = useInput<SelectOption<string>>(
    { value: "" },
    (value) => value.value === "public" || value.value === "private"
  );

  const {
    enteredValue: type,
    isInputValid: typeValueValid,
    isInputValid: typeInputValid,
    changeHandler: typeChangeHandler,
    blurHandler: typeBlurHandler,
  } = useInput<SelectOption<string>>(
    { value: "" },
    (value) => value.value === "group session" || value.value === "workshop"
  );

  const roomSearchPromise: SearchPromise<Room> = async (search) => {
    const result = await fetch(`/api/meetings/rooms?startwith=${search}`);

    if (result.ok) {
      const rooms: { result: Room[] } = await result.json();

      return rooms.result.map((room) => ({ label: room.name, value: room }));
    }

    // else if bad, do nothing
    return [];
  };

  const invitesSearchPromise: SearchPromise<{
    email: string;
    id: number;
  }> = async (search) => {
    // const result = await fetch(`/api/meetings/rooms?startwith=${search}`);
    // if (result.ok) {
    //   const rooms: { result: Room[] } = await result.json();
    //   return rooms.result.map((room) => ({ label: room.label, value: room }));
    // }
    // // else if bad, do nothing
    // return [];
    try {
      const data = await index({
        resource: "users",
        args: {
          fields: ["email", "id"],
          startswith: search,
        },
      });
      console.log(data);
      return data.users.map((user: { email: string; id: number }) => ({
        label: user.email,
        value: user.id,
      }));
    } catch (errors) {
      console.log("errors");
    }
  };

  const sendMeetingData = async () => {
    const body = {
      title: title,
      host: userId,
      room: room,
      link: link,
      date: date,
      time: time,
      description: description,
      capacity: capacity,
      visibility: visibility,
      type: type,
      invites: invites,
    };

    try {
      await store({
        resource: "meetings",
        body: body,
      });
    } catch (errors) {
      console.log(errors);
    }
  };

  function showErrors() {
    // this will also make errors show if needed
    titleBlurHandler();
    linkBlurHandler();
    dateBlurHandler();
    descriptionBlurHandler();
    typeBlurHandler();
    invitesBlurHandler();
    visibilityBlurHandler();
    roomBlurHandler();
    timeBlurHandler();
    capacityBlurHandler();
  }

  const submitHandler: FormEventHandler = (event) => {
    event.preventDefault();
    if (
      roomValueValid &&
      timeValueValid &&
      capacityValueValid &&
      visibilityValueValid &&
      dateValueValid &&
      timeValueValid &&
      typeValueValid &&
      (invitesValueValid || visibility.value === "public") &&
      titleValueValid
    ) {
      // send off this event to the backend
      sendMeetingData();
    } else {
      showErrors();
    }
  };

  return (
    <DashboardSubpageLayout title={"Create a Group Session"}>
      <form
        className={styles.CreateWorkshop}
        data-testid="CreateWorkshop"
        onSubmit={submitHandler}
      >
        <TextInput
          id={"title"}
          label={"Session Title"}
          placeholder={"Please provide the title of your group session."}
          value={title}
          isValid={titleInputValid}
          onChange={titleChangeHandler}
          onBlur={titleBlurHandler}
        />

        <Select
          id={"visibility"}
          label={"Meeting Visibility"}
          placeholder={"Public or Private?"}
          options={[
            { value: "public", label: "Public (anyone can join)" },
            { value: "private", label: "Private (select who is invited)" },
          ]}
          value={visibility}
          isValid={visibilityInputValid}
          onChange={visibilityChangeHandler}
          onBlur={visibilityBlurHandler}
        />

        {visibility.value === "private" && (
          <SearchSelect
            id={"invites"}
            label={"Emails of invited"}
            isValid={invitesInputValid}
            value={invites}
            onChange={invitesChangeHandler}
            onBlur={invitesBlurHandler}
            searchPromise={invitesSearchPromise}
          />
        )}

        <Select
          id={"type"}
          label={"Meeting Type"}
          placeholder={"Please select the session type."}
          options={[
            {
              value: "workshop",
              label: "Workshop (generally more hands-on session)",
            },
            {
              value: "group session",
              label: "Group Session (generally more theoretical)",
            },
          ]}
          value={type}
          isValid={typeInputValid}
          onChange={typeChangeHandler}
          onBlur={typeBlurHandler}
        />
        <SearchSelect
          id={"room"}
          label={"Room"}
          isValid={roomInputValid}
          value={room}
          onChange={roomChangeHandler}
          onBlur={roomBlurHandler}
          searchPromise={roomSearchPromise}
          limit={1}
        />

        <TextInput
          id={"invite"}
          label={"Meeting Link - for online events"}
          placeholder={"Please provide the meeting link"}
          value={link}
          isValid={true}
          onChange={linkChangeHandler}
          onBlur={linkBlurHandler}
        />

        <DatePicker
          id={"date"}
          label={"Date"}
          value={date}
          isValid={dateInputValid}
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
          mustBeConsecutive={true}
        />

        <BigTextInput
          id={"description"}
          label={"Description"}
          placeholder={"Tell attendees what the event is about"}
          value={description}
          isValid={true}
          onChange={descriptionChangeHandler}
          onBlur={descriptionBlurHandler}
        />

        <TextInput
          id={"capacity"}
          label={"Capacity"}
          placeholder={""}
          value={capacity.toString()}
          isValid={capacityInputValid}
          type={"number"}
          onChange={(newValue) => capacityChangeHandler(parseInt(newValue))}
          onBlur={capacityBlurHandler}
        />

        <Button icon="👑" type={"submit"} buttonStyle={"primary"}>
          Register
        </Button>
      </form>
    </DashboardSubpageLayout>
  );
};

export default CreateWorkshop;
