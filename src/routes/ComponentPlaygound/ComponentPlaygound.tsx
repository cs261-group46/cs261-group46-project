import React, {FC, useState} from 'react';
import styles from './ComponentPlaygound.module.scss';
import PageStepper from "../../components/UI/PageStepper/PageStepper";
import PieView from "../../components/UI/PieView/PieView";
import HoursInput from "../../components/UI/FormInput/HoursInput/HoursInput";
import SearchSelect from "../../components/UI/FormInput/SearchSelect/SearchSelect";
import { MultiSelectOptions } from "../../components/UI/FormInput/SearchSelect/SearchSelect.d";
import useInput from "../../hooks/UseInput/UseInput";

interface ComponentPlaygoundProps {}

const ComponentPlaygound: FC<ComponentPlaygoundProps> = () => {
    const [page, setPage] = useState(0);
    const {
        enteredValue: searchValue,
        changeHandler: searchChange,
        blurHandler: searchBlur
    } = useInput<MultiSelectOptions<string>>([], () => true)

    return <div className={styles.ComponentPlaygound} data-testid="ComponentPlaygound">
        <PageStepper page={page} setPage={setPage} maxPages={5}/>
        <PieView segments={[
            {fr: 2, fill: "#07A417", label: "Active"},
            {fr: 1, fill: "#393838", label: "Completed"}
        ]}/>
        <HoursInput label={"hour"} isValid={true} value={[]} onChange={() => {}} onBlur={() => {}}/>

        <SearchSelect
            id={"search"}
            label={"Test"}
            isValid={true}
            value={searchValue}
            onChange={searchChange}
            onBlur={searchBlur}
            type={"draggable"}
            searchPromise={_value => new Promise(resolve => setTimeout(() => resolve([
                {
                    label: "Test 1",
                    value: "1"
                },
                {
                    label: "Test 2",
                    value: "2"
                },
            ]), 0))}
        />
    </div>
}

export default ComponentPlaygound;
