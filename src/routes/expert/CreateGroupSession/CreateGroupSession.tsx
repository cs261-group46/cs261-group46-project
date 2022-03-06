import React, { FC, FormEventHandler, useCallback } from "react";

import styles from "./CreateGroupSession.module.scss";
import SearchSelect from "../../../components/UI/FormInput/SearchSelect/SearchSelect";
import {
  SearchSelectOptions,
  SearchPromise,
} from "../../../components/UI/FormInput/SearchSelect/SearchSelect";
import useInput from "../../../hooks/UseInput/UseInput";
import DatePicker from "../../../components/UI/FormInput/DatePicker/DatePicker";
import HoursInput, {
  Range,
} from "../../../components/UI/FormInput/HoursInput/HoursInput";
import BigTextInput from "../../../components/UI/FormInput/BigTextInput/BigTextInput";
import TextInput from "../../../components/UI/FormInput/TextInput/TextInput";
import Select from "../../../components/UI/FormInput/Select/Select";

import { SelectOption } from "../../../components/UI/FormInput/Select/Select";

import Button from "../../../components/UI/Button/Button";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import { useNavigate } from "react-router-dom";
import { index, store } from "../../../api/api";
import { Room } from "../../../types/Room";
import UseVerifyUser from "../../../hooks/UseVerifyUser/UseVerifyUser";

interface CreateGroupSessionProps {}

const CreateGroupSession: FC<CreateGroupSessionProps> = () => {
  const { userId = null } = UseVerifyUser<{
    userId: number | null | undefined;
    expert_id: number | null | undefined;
  }>({
    userDataPolicies: [
      {
        dataPoint: "expert.id",
        redirectOnFail: "/dashboard",
      },
    ],
  });

  const navigate = useNavigate();

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
  } = useInput<SearchSelectOptions<Room>>([], (value) => value.length > 0);

  const {
    enteredValue: invites,
    changeHandler: invitesChangeHandler,
    blurHandler: invitesBlurHandler,
    isInputValid: invitesInputValid,
    isValueValid: invitesValueValid,
  } = useInput<SearchSelectOptions<{ email: string; id: number }>>(
    [],
    (value) => value.length > 0
  );

  const getTopics = async (startsWith: string) => {
    try {
      const data = await index({
        resource: "topics",
        args: {
          startswith: startsWith,
        },
      });
      const options: SearchSelectOptions<number> = data.topics.map(
        ({ label, id }: { label: string; id: number }) => ({
          label,
          value: id,
        })
      );

      return options;
    } catch (errors) {
      console.log(errors);
      return [];
    }
  };

  const topicsSearchPromise: SearchPromise<number> = (_search) => {
    return new Promise((resolve) => resolve(getTopics(_search)));
  };

  const {
    enteredValue: topics,
    changeHandler: topicsChangeHandler,
    blurHandler: topicsBlurHandler,
    isInputValid: topicsInputValid,
    isValueValid: topicsValueValid,
  } = useInput<SearchSelectOptions<number>>([]);

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
  } = useInput<Date>(new Date(), (date) => date >= new Date());

  const {
    enteredValue: startTime,
    changeHandler: startTimeChangeHandler,
    blurHandler: startTimeBlurHandler,
    isInputValid: startTimeInputValid,
    isValueValid: startTimeValueValid,
  } = useInput<string>("");

  const {
    enteredValue: endTime,
    changeHandler: endTimeChangeHandler,
    blurHandler: endTimeBlurHandler,
    isInputValid: endTimeInputValid,
    isValueValid: endTimeValueValid,
  } = useInput<string>("", (e) => {
    const start = new Date("1970-01-01T" + startTime + "Z");
    const end = new Date("1970-01-01T" + e + "Z");
    console.log(start);
    console.log(end);

    return start < end;
  });

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

  const roomsSearchPromise: SearchPromise<Room> = useCallback(
    async (search) => {
      try {
        const data = await index({
          resource: "rooms",
          args: {
            startswith: search,
          },
        });
        return data.rooms.map((room: Room) => ({
          label: room.name,
          value: room,
        }));
      } catch (errors) {
        console.log(errors);
      }
    },
    []
  );

  const invitesSearchPromise: SearchPromise<{
    email: string;
    id: number;
  }> = async (search) => {
    try {
      const data = await index({
        resource: "users",
        args: {
          fields: ["email", "id"],
          startswith: search,
        },
      });
      return data.users.map((user: { email: string; id: number }) => ({
        label: user.email,
        value: user,
      }));
    } catch (errors) {
      console.log(errors);
    }
  };

  const sendMeetingData = async () => {
    const body = {
      title: title,
      host: userId,
      room: room[0].value,
      link: link,
      date: date,
      startTime: startTime,
      endTime: endTime,
      description: description,
      capacity: capacity,
      visibility: visibility,
      type: type,
      invites: invites.map((invite) => invite.value),
    };

    try {
      await store({
        resource: "meetings",
        body: body,
      });
      navigate("/expert/group-sessions");
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
    startTimeBlurHandler();
    capacityBlurHandler();
    endTimeBlurHandler();
    topicsBlurHandler();
  }

  const submitHandler: FormEventHandler = (event) => {
    event.preventDefault();
    if (
      roomValueValid &&
      startTimeValueValid &&
      capacityValueValid &&
      visibilityValueValid &&
      dateValueValid &&
      startTimeValueValid &&
      typeValueValid &&
      (invitesValueValid || visibility.value === "public") &&
      titleValueValid &&
      endTimeValueValid &&
      topicsValueValid
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
        className={styles.CreateGroupSession}
        data-testid="CreateGroupSession"
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
        <BigTextInput
          id={"description"}
          label={"Description"}
          placeholder={"Tell attendees what the event is about"}
          value={description}
          isValid={true}
          onChange={descriptionChangeHandler}
          onBlur={descriptionBlurHandler}
        />
        <SearchSelect
          id={"topics"}
          label={"Topics Covered"}
          isValid={topicsInputValid}
          value={topics}
          onChange={topicsChangeHandler}
          onBlur={topicsBlurHandler}
          searchPromise={topicsSearchPromise}
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

        <DatePicker
          id={"date"}
          label={"Date"}
          value={date}
          isValid={dateInputValid}
          onChange={dateChangeHandler}
          onBlur={dateBlurHandler}
        />

        <TextInput
          id={"time"}
          label={"Start time"}
          isValid={startTimeInputValid}
          value={startTime}
          onChange={startTimeChangeHandler}
          onBlur={startTimeBlurHandler}
          placeholder={"Please provide the start time of the session"}
          type="time"
        />

        <TextInput
          id={"duration"}
          label={"End time"}
          isValid={endTimeInputValid}
          value={endTime}
          onChange={endTimeChangeHandler}
          onBlur={endTimeBlurHandler}
          placeholder={"Please provide the start time of the session"}
          type="time"
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

        <SearchSelect
          id={"room"}
          label={"Room - only showing available"}
          isValid={roomInputValid}
          value={room}
          onChange={roomChangeHandler}
          onBlur={roomBlurHandler}
          searchPromise={roomsSearchPromise}
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

        <Button icon="👑" type={"submit"} buttonStyle={"primary"}>
          Create
        </Button>
      </form>
    </DashboardSubpageLayout>
  );
};

export default CreateGroupSession;
