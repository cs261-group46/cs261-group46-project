import React, {
  FC,
  FormEventHandler,
  Fragment,
  useCallback,
  useEffect,
  useState,
} from "react";
import styles from "./CreateMeeting.module.scss";
import SearchSelect from "../../../components/UI/FormInput/SearchSelect/SearchSelect";
import {
  SearchSelectOptions,
  SearchPromise,
} from "../../../components/UI/FormInput/SearchSelect/SearchSelect";
import useInput from "../../../hooks/UseInput/UseInput";
import DatePicker from "../../../components/UI/FormInput/DatePicker/DatePicker";
import BigTextInput from "../../../components/UI/FormInput/BigTextInput/BigTextInput";
import TextInput from "../../../components/UI/FormInput/TextInput/TextInput";
import Button from "../../../components/UI/Button/Button";
import UseVerifyUser from "../../../hooks/UseVerifyUser/UseVerifyUser";
import { useNavigate, useParams } from "react-router-dom";
import { get, index, store } from "../../../api/api";
import { Room } from "../../../types/Room";
import UseSystemMessage from "../../../hooks/UseSystemMessage/UseSystemMessage";
import DashboardSubpageLayout from "../../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";

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

  const showMessage = UseSystemMessage();

  const [theirsPosition, setTheirsPosition] = useState<
    "mentor" | "mentee" | null
  >();
  const [validated, setValidated] = useState(false);
  const [theirsData, setTheirsData] = useState<{ id: number; email: string }>();

  let { menteeId } = useParams();
  const navigate = useNavigate();

  const validateRoleAndGetEmail = useCallback(async () => {
    if ((!mentee_id && !mentor_id) || menteeId === undefined) {
      showMessage("error", "You do not have permission to access this page.");
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
          showMessage(
            "error",
            "You do not have permission to access this page."
          );

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
          showMessage("error", errors);
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
        showMessage("error", errors);
      }
      setValidated(true);
      setTheirsPosition("mentor");
    }
  }, [menteeId, mentee_id, mentor_id, navigate, showMessage]);

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
  } = useInput<SearchSelectOptions<Room>>([], (value) => value.length <= 1);

  const {
    enteredValue: link,
    isInputValid: linkInputValid,
    isValueValid: linkValueValid,
    changeHandler: linkChangeHandler,
    blurHandler: linkBlurHandler,
  } = useInput<string>("", (value) => value.length < 200);

  const {
    enteredValue: date,
    isInputValid: dateInputValid,
    isValueValid: dateValueValid,
    changeHandler: dateChangeHandler,
    blurHandler: dateBlurHandler,
  } = useInput<Date>(new Date(), (d) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d.getTime() >= today.getTime();
  });

  const {
    enteredValue: startTime,
    changeHandler: startTimeChangeHandler,
    blurHandler: startTimeBlurHandler,
    isInputValid: startTimeInputValid,
    isValueValid: startTimeValueValid,
  } = useInput<string>("", (startTime) => {
    if (startTime) {
      date.setHours(Number.parseInt(startTime.substring(0, 2)));
      date.setMinutes(Number.parseInt(startTime.substring(3)));
    }
    const now = new Date();
    return date.getTime() >= now.getTime();
  });

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
        showMessage("error", errors);
      }
    },
    [showMessage]
  );

  const sendMeetingData = async () => {
    const body = {
      title: title,
      host: userId,
      room: room.length === 1 ? room[0].value.id : undefined,
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
      showMessage("success", "Meeting created successfully.");
      navigate(`/meetings/${menteeId}`);
    } catch (errors) {
      showMessage("error", errors);
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
    linkBlurHandler();
  }

  const submitHandler: FormEventHandler = (event) => {
    event.preventDefault();
    if (
      roomValueValid &&
      dateValueValid &&
      startTimeValueValid &&
      endTimeValueValid &&
      descriptionValueValid &&
      titleValueValid &&
      linkValueValid &&
      (link.length > 0 || room.length === 1)
    ) {
      sendMeetingData();
      // send off this event to the backend
    } else {
      showErrors();
      if (!(room.length === 1 || link.length > 0)) {
        showMessage(
          "error",
          "For in person events - please specify the room. For online events - please specify the link."
        );
      }
    }
  };

  return (
    <DashboardSubpageLayout title={"Create a Meeting"}>
      <form
        className={styles.CreateMeeting}
        data-testid="CreateMeeting"
        onSubmit={submitHandler}
      >
        {validated && (
          <Fragment>
            <p>
              For online events, capacity and room is not required. For
              in-person events, link is not required. An event can be both
              online and in person.
            </p>
            <TextInput
              id={"title"}
              label={"Session Title"}
              icon="📝"
              placeholder={"Please provide the title of your meeting."}
              value={title}
              isValid={titleInputValid}
              onChange={titleChangeHandler}
              onBlur={titleBlurHandler}
            />
            <DatePicker
              id={"date"}
              label={"Date"}
              icon="📅"
              value={date}
              isValid={dateInputValid}
              onChange={dateChangeHandler}
              onBlur={dateBlurHandler}
            />

            <TextInput
              id={"time"}
              label={"Start time"}
              icon="🕒"
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
              icon="🕘"
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
              icon="🏠"
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
              icon="🖋️"
              placeholder={
                "Include what you'd like to talk about in the meeting"
              }
              value={description}
              isValid={descriptionInputValid}
              onChange={descriptionChangeHandler}
              onBlur={descriptionBlurHandler}
            />

            <TextInput
              id={"link"}
              label={"Meeting Link - for online events"}
              icon="🔗"
              placeholder={"Please provide the meeting link"}
              value={link}
              isValid={linkInputValid}
              onChange={linkChangeHandler}
              onBlur={linkBlurHandler}
            />

            <Button icon="👑" type={"submit"} buttonStyle={"primary"}>
              Create Meeting
            </Button>
          </Fragment>
        )}
      </form>
    </DashboardSubpageLayout>
  );
};

export default CreateMeeting;
