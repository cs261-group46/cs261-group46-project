import React ,{useState} from 'react';
import MainLayout from "../../layouts/MainLayout/MainLayout";
import Button from "../../components/UI/Button/Button";
import styles from './Expert.module.scss';
import MultiSelect from "../../components/UI/FormInput/MultiSelect/MultiSelect";
import useInput from "../../hooks/UseInput/UseInput";
import { MultiSelectOptions, SearchPromise } from "../../components/UI/FormInput/MultiSelect/MultiSelect.d";

function Expert() {
    const [showExpertise, setShowExpertise] = useState(0);

    const increment = () => {
        setShowExpertise(1);
    }

    function validateExpertises(_experises : MultiSelectOptions<string>) {
        return true;
    }

    const searchPromise: SearchPromise = (_search) => {
        return new Promise((resolve) =>
          resolve([
            { label: "Tracking", value: "tracking" },
            { label: "Training", value: "training" },
          ])
        );
      };

    const {
        enteredValue: enteredExpertises,
        isInputValid: isInputExpertisesValid,
        changeHandler: expertisesChangeHandler,
        blurHandler: expertisesBlurHandler,
      } = useInput<MultiSelectOptions<string>>(validateExpertises, []);


    return (
        <div>
            <MainLayout title="Setup">
        </MainLayout>
        <h1 className={styles.h1}>Would you like to be an expert?</h1>
        <h2 className={styles.h2}>Experts can organise group workshops.</h2>
        {showExpertise === 0 && (<h3 className={styles.h3}>You can change your choice later.</h3>)}
        <div className={styles.together}>
        {showExpertise === 0 && (<Button icon="✅" onClick={increment} buttonStyle={"primary"}>
        Yes
      </Button>)}
      <span className={styles.b2}>
      {showExpertise === 0 && (<Button icon="❌" href="/dashboard">
        No
      </Button>)}
      </span>
      </div>
      {showExpertise === 0 && (<a className = {styles.a} href="/dashboard">Finish setup later</a>)}
      {showExpertise === 1 && (<MultiSelect
        id="expertise"
        label="Fields of Expertise"
        value={enteredExpertises}
        isValid={isInputExpertisesValid}
        onChange={expertisesChangeHandler}
        onBlur={expertisesBlurHandler}
        icon="💪"
        searchPromise={searchPromise}
      />)}
      {showExpertise === 1 && (<a className = {styles.a} href="/dashboard">No, I would not like to be an expert</a>)}
      {showExpertise === 1 && (<Button icon="➡️" buttonStyle={"primary"}>
        Continue
      </Button>)}
      {showExpertise === 1 && (<a className = {styles.a} href="/dashboard">Finish setup later</a>)}
        </div>
    );
}

export default Expert;