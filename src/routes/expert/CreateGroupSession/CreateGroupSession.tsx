import React, { FC, useCallback } from "react";

// import styles from "./CreateGroupSession.module.scss";
import SearchSelect from "../../../components/UI/FormInput/SearchSelect/SearchSelect";
import {
  SearchSelectOptions,
  SearchPromise,
} from "../../../components/UI/FormInput/SearchSelect/SearchSelect";
import useInput from "../../../hooks/UseInput/UseInput";
import DatePicker from "../../../components/UI/FormInput/DatePicker/DatePicker";
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
import UseSystemMessage from "../../../hooks/UseSystemMessage/UseSystemMessage";

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

  const showMessage = UseSystemMessage();

  const navigate = useNavigate();

  const {
    enteredValue: title,
    isInputValid: titleInputValid,
    isValueValid: titleValueValid,
    changeHandler: titleChangeHandler,
    blurHandler: titleBlurHandler,
  } = useInput<string>("", (t) => t.length > 0);

  const {
    enteredValue: room,
    changeHandler: roomChangeHandler,
    blurHandler: roomBlurHandler,
    isInputValid: roomInputValid,
    isValueValid: roomValueValid,
  } = useInput<SearchSelectOptions<Room>>([], (value) => value.length === 1);

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

  const getTopics = useCallback(async (startsWith: string) => {
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
      return [];
    }
  }, []);

  const topicsSearchPromise: SearchPromise<number> = useCallback(
    (_search) => {
      return new Promise((resolve) => resolve(getTopics(_search)));
    },
    [getTopics]
  );

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
  } = useInput<Date>(new Date(), (d) => d >= new Date());

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
    return start < end;
  });

  const {
    enteredValue: description,
    changeHandler: descriptionChangeHandler,
    blurHandler: descriptionBlurHandler,
    isInputValid: descriptionInputValid,
    isValueValid: descriptionValueValid,
  } = useInput<string>("", (d) => d.length < 1000);

  const {
    enteredValue: capacity,
    changeHandler: capacityChangeHandler,
    isInputValid: capacityInputValid,
    isValueValid: capacityValueValid,
    blurHandler: capacityBlurHandler,
  } = useInput<string>("");

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
        // return rooms;
      } catch (errors) {}
    },
    [showMessage]
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
      showMessage("error", errors);
    }
  };

  const sendMeetingData = async () => {
    try {
      const body = {
        title: title,
        host: userId,
        room: room[0].value.id,
        link: link,
        topics: topics.map((topic) => topic.value),
        date: date,
        startTime: startTime,
        endTime: endTime,
        description: description,
        capacity: parseInt(capacity),
        visibility: visibility.value,
        type: type.value,
        invites: invites.map((invite) => invite.value),
      };
      await store({
        resource: "meetings",
        body: body,
      });
      showMessage("success", "Group session created successfully.");
      navigate("/expert/group-sessions");
    } catch (errors) {
      showMessage("error", errors);
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
    descriptionBlurHandler();
  }

  const submitHandler = () => {
    if (
      roomValueValid &&
      startTimeValueValid &&
      capacityValueValid &&
      visibilityValueValid &&
      dateValueValid &&
      typeValueValid &&
      (invitesValueValid || visibility.value === "public") &&
      titleValueValid &&
      endTimeValueValid &&
      topicsValueValid &&
      descriptionValueValid
    ) {
      // send off this event to the backend
      sendMeetingData();
    } else {
      showErrors();
    }
  };

  return (
    <DashboardSubpageLayout title={"Create a Group Session"}>
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
        isValid={descriptionInputValid}
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
        value={capacity}
        isValid={true}
        type={"number"}
        onChange={capacityChangeHandler}
        onBlur={capacityBlurHandler}
      />

      <SearchSelect
        id={"room"}
        label={"Room"}
        isValid={roomInputValid}
        value={room}
        onChange={roomChangeHandler}
        onBlur={roomBlurHandler}
        searchPromise={roomsSearchPromise}
        limit={1}
      />

      <TextInput
        id={"link"}
        label={"Meeting Link - for online events"}
        placeholder={"Please provide the meeting link"}
        value={link}
        isValid={true}
        onChange={linkChangeHandler}
        onBlur={linkBlurHandler}
      />

      <Button icon="👑" onClick={submitHandler} buttonStyle={"primary"}>
        Create
      </Button>
    </DashboardSubpageLayout>
  );
};

export default CreateGroupSession;
