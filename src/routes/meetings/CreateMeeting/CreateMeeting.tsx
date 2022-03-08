import React, {
  FC,
  FormEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";
import styles from "./CreateMeeting.module.scss";
import MainLayout from "../../../layouts/MainLayout/MainLayout";
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
import Button from "../../../components/UI/Button/Button";
import UseVerifyAuth from "../../../hooks/UseVerifyAuth/UseVerifyAuth";
import UseVerifyUser from "../../../hooks/UseVerifyUser/UseVerifyUser";
import { useNavigate, useParams } from "react-router-dom";
import { get, index, store } from "../../../api/api";
import { Room } from "../../../types/Room";

interface CreateMeetingProps {}

const CreateMeeting: FC<CreateMeetingProps> = () => {
  const {
    userId = null,
    mentee_id = null,
    mentor_id = null,
  } = UseVerifyUser<{
    userId: number | null | undefined;
    mentee_id: number | null | undefined;
    mentor_id: number | null | undefined;
  }>({
    userDataPolicies: [
      {
        dataPoint: "mentee.id",
      },
      {
        dataPoint: "mentor.id",
      },
    ],
  });

  const [theirsPosition, setTheirsPosition] = useState<
    "mentor" | "mentee" | null
  >();
  const [validated, setValidated] = useState(false);
  const [theirsData, setTheirsData] = useState<{ id: number; email: string }>();

  let { menteeId } = useParams();
  const navigate = useNavigate();

  const validateRoleAndGetEmail = useCallback(async () => {
    if ((!mentee_id && !mentor_id) || menteeId === undefined) {
      return navigate("/dashboard");
    }
    if (mentee_id !== Number.parseInt(menteeId)) {
      try {
        const data = await get({
          resource: "mentees",
          entity: Number.parseInt(menteeId),
          args: {
            fields: ["mentor.id"],
          },
        });

        if (mentor_id !== data.mentee.mentor.id) {
          return navigate("/dashboard");
        }

        try {
          const data = await get({
            resource: "mentees",
            entity: Number.parseInt(menteeId),
            args: {
              fields: ["user.email", "user.id"],
            },
          });
          setTheirsData({
            email: data.mentee.user.email,
            id: data.mentee.user.id,
          });
        } catch (errors) {
          console.log(errors);
        }
        setValidated(true);
        setTheirsPosition("mentee");
      } catch (errors) {
        console.log(errors);
      }
    } else {
      try {
        const data = await get({
          resource: "mentees",
          entity: Number.parseInt(menteeId),
          args: {
            fields: ["mentor.user.email", "mentor.user.id"],
          },
        });

        setTheirsData({
          email: data.mentee.mentor.user.email,
          id: data.mentee.mentor.user.id,
        });
      } catch (errors) {
        console.log(errors);
      }
      setValidated(true);
      setTheirsPosition("mentor");
    }
  }, [menteeId, mentee_id, mentor_id, navigate]);

  useEffect(() => {
    if (userId) {
      validateRoleAndGetEmail();
    }
  }, [userId, validateRoleAndGetEmail]);

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
    isInputValid: descriptionInputValid,
    isValueValid: descriptionValueValid,
  } = useInput<string>("");

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
      capacity: 1,
      visibility: "private",
      type: "one on one meeting",
      as: theirsPosition === "mentee" ? "mentor" : "mentee",
      invites: [theirsData],
    };

    try {
      await store({
        resource: "meetings",
        body: body,
      });
      navigate(`/meetings/${menteeId}`);
    } catch (errors) {
      console.log(errors);
    }
  };

  function showErrors() {
    // this will also make errors show if needed
    roomBlurHandler();
    startTimeBlurHandler();
    endTimeBlurHandler();
    dateBlurHandler();
    descriptionBlurHandler();
    titleBlurHandler();
  }

  const submitHandler: FormEventHandler = (event) => {
    event.preventDefault();
    if (
      roomValueValid &&
      dateValueValid &&
      startTimeValueValid &&
      endTimeValueValid &&
      descriptionValueValid &&
      titleValueValid
    ) {
      sendMeetingData();
      // send off this event to the backend
    } else {
      showErrors();
    }
  };

  return (
    <MainLayout title={"Create a Meeting"}>
      {validated && (
        <form
          className={styles.CreateMeeting}
          data-testid="CreateMeeting"
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

          <BigTextInput
            id={"description"}
            label={`Note to ${theirsPosition}`}
            placeholder={"Include what you'd like to talk about in the meeting"}
            value={description}
            isValid={descriptionInputValid}
            onChange={descriptionChangeHandler}
            onBlur={descriptionBlurHandler}
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

          <Button icon="👑" type={"submit"} buttonStyle={"primary"}>
            Create Meeting
          </Button>
        </form>
      )}
    </MainLayout>
  );
};

export default CreateMeeting;
