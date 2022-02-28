import React, { FC } from 'react';
import styles from './CreateWorkshop.module.scss';
import MainLayout from "../../layouts/MainLayout/MainLayout";
import SearchSelect from "../../components/UI/FormInput/SearchSelect/SearchSelect";
import {MultiSelectOptions, SearchPromise} from "../../components/UI/FormInput/SearchSelect/SearchSelect.d";
import useInput from "../../hooks/UseInput/UseInput";
import DatePicker from "../../components/UI/FormInput/DatePicker/DatePicker";
import HoursInput, {Range} from "../../components/UI/FormInput/HoursInput/HoursInput";
import BigTextInput from "../../components/UI/FormInput/BigTextInput/BigTextInput";
import TextInput from "../../components/UI/FormInput/TextInput/TextInput";
import Select from "../../components/UI/FormInput/Select/Select";
import {SelectOption} from "../../components/UI/FormInput/Select/Select.d";
import SystemMessage from "../../components/UI/SystemMessage/SystemMessage";
import Button from "../../components/UI/Button/Button";

interface CreateWorkshopProps {}

interface Room {
    id: number;
    label: string;
}

const CreateWorkshop: FC<CreateWorkshopProps> = () => {
    const {
        enteredValue: room,
        changeHandler: roomChangeHandler,
        blurHandler: roomBlurHandler,
        isInputValid: roomValid,
    } = useInput<MultiSelectOptions<Room>>(value => value.length > 0, []);

    const {
        enteredValue: invite,
        changeHandler: inviteChangeHandler,
        blurHandler: inviteBlurHandler,
    } = useInput<string>(() => true, "");

    const {
        enteredValue: date,
        changeHandler: dateChangeHandler,
        blurHandler: dateBlurHandler
    } = useInput<Date>(() => true, new Date());

    const {
        enteredValue: time,
        changeHandler: timeChangeHandler,
        blurHandler: timeBlurHandler,
        isInputValid: timeValid,
    } = useInput<Range[]>(value => value.length === 1, []);

    const {
        enteredValue: description,
        changeHandler: descriptionChangeHandler,
        blurHandler: descriptionBlurHandler
    } = useInput<string>(() => true, "");

    const {
        enteredValue: capacity,
        changeHandler: capacityChangeHandler,
        isInputValid: capacityValid,
        blurHandler: capacityBlurHandler
    } = useInput<number>((value) => value > 0, 0);

    const {
        enteredValue: type,
        changeHandler: typeChangeHandler,
        blurHandler: typeBlurHandler
    } = useInput<SelectOption<string>>((value) => value.id !== "", {id: ""});

    const searchPromise: SearchPromise<Room> = async search => {
        const result = await fetch(`/api/meetings/rooms?startwith=${search}`);

        if (result.ok) {
            const rooms: {result: Room[]} = await result.json();

            return rooms.result.map(room => ({label: room.label, value: room}));
        }

        // else if bad, do nothing
        return [];
    };

    const registrationHandler = () => {
        // ensure all the values are valid by forcing a blur
        // this will also make errors show if needed
        roomBlurHandler();
        timeBlurHandler();
        capacityBlurHandler();

        if (
            roomValid &&
            timeValid &&
            capacityValid
        ) {
            // send off this event to the backend
        }
    }

    return <MainLayout title={"Create a Workshop"}>
        <div className={styles.CreateWorkshop} data-testid="CreateWorkshop">
            <SearchSelect
                id={"room"}
                label={"Room"}
                isValid={true}
                value={room}
                onChange={roomChangeHandler}
                onBlur={roomBlurHandler}
                searchPromise={searchPromise}
                limit={1}
            />

            <SystemMessage sort={"inline"} type={"alert"} description={"Please select a room"} visible={!roomValid} noX/>

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
                isValid={true}
                value={time}
                onChange={timeChangeHandler}
                onBlur={timeBlurHandler}
                width={"150px"}
            />

            <SystemMessage sort={"inline"} type={"alert"} description={"Please select 1 range of times"} visible={!timeValid} noX/>

            <BigTextInput
                id={"description"}
                label={"Description"}
                placeholder={"Tell attendees what the event is about"}
                value={description}
                isValid={true}
                onChange={descriptionChangeHandler}
                onBlur={descriptionBlurHandler}/>
            
            <TextInput
                id={"capacity"}
                label={"Capacity"}
                placeholder={""}
                value={capacity.toString()}
                isValid={capacityValid}
                type={"number"}
                onChange={newValue => capacityChangeHandler(parseInt(newValue))}
                onBlur={capacityBlurHandler}
            />

            <SystemMessage sort={"inline"} type={"alert"} description={"Capacity must be greater than 0"} visible={!capacityValid} noX/>

            <Select
                id={"type"}
                label={"Meeting Type"}
                placeholder={"Public or Private?"}
                options={[{id: "public", label: "Public (visible on Workshops)"}, {id: "private", label: "Private (requires a link)"}]}
                value={type}
                isValid={true}
                onChange={typeChangeHandler}
                onBlur={typeBlurHandler}
            />

            <Button icon="👑" onClick={registrationHandler} buttonStyle={"primary"}>
                Register
            </Button>
        </div>
    </MainLayout>
}

export default CreateWorkshop;
