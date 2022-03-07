import React, { FC, useState } from "react";
import styles from "./ComponentPlaygound.module.scss";
import PageStepper from "../../components/UI/PageStepper/PageStepper";
import PieView from "../../components/UI/PieView/PieView";
import HoursInput from "../../components/UI/FormInput/HoursInput/HoursInput";
import SearchSelect, {
  SearchSelectOptions,
} from "../../components/UI/FormInput/SearchSelect/SearchSelect";
import useInput from "../../hooks/UseInput/UseInput";
import StarPicker from "../../components/UI/FormInput/StarPicker/StarPicker";

interface ComponentPlaygoundProps {}

const ComponentPlaygound: FC<ComponentPlaygoundProps> = () => {
  const [page, setPage] = useState(0);
  const {
    enteredValue: searchValue,
    changeHandler: searchChange,
    blurHandler: searchBlur,
  } = useInput<SearchSelectOptions<string>>([], () => true);

  const {
    enteredValue: starsValue,
    changeHandler: starsChange,
    blurHandler: starsBlur,
  } = useInput<number | undefined>(2, (value) => value !== undefined);

  return (
    <div className={styles.ComponentPlaygound} data-testid="ComponentPlaygound">
      <PageStepper page={page} setPage={setPage} maxPages={5} />
      <PieView
        segments={[
          { fr: 2, fill: "#07A417", label: "Active" },
          { fr: 1, fill: "#393838", label: "Completed" },
        ]}
      />
      <HoursInput
        label={"hour"}
        isValid={true}
        value={[]}
        onChange={() => {}}
        onBlur={() => {}}
        allowedRanges={[[0, 15]]}
        maxHours={3}
        mustBeConsecutive
      />

      <SearchSelect
        id={"search"}
        label={"Test"}
        isValid={true}
        value={searchValue}
        onChange={searchChange}
        onBlur={searchBlur}
        type={"draggable"}
        searchPromise={(_value) =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve([
                  {
                    label: "Test 1",
                    value: "1",
                  },
                  {
                    label: "Test 2",
                    value: "2",
                  },
                ]),
              0
            )
          )
        }
      />

      <StarPicker
        type={"interactive"}
        id={"stars"}
        label={"Some Stars"}
        value={starsValue}
        isValid={true}
        onChange={starsChange}
        onBlur={starsBlur}
      />

      <p>
        Rating: <StarPicker type={"inline"} value={3} size={"32"} />
      </p>
    </div>
  );
};

export default ComponentPlaygound;
