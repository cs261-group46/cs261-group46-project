import React, { FC, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { index, update } from "../../api/api";
import Button from "../../components/UI/Button/Button";
import Select, {
  SelectOption,
  SelectOptions,
} from "../../components/UI/FormInput/Select/Select";
import TextInput from "../../components/UI/FormInput/TextInput/TextInput";
import useInput from "../../hooks/UseInput/UseInput";
import UseSystemMessage from "../../hooks/UseSystemMessage/UseSystemMessage";
import UseVerifyUser from "../../hooks/UseVerifyUser/UseVerifyUser";
import DashboardSubpageLayout from "../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import { DepartmentType } from "../../types/Department";

interface UserEditDetailsProps {}

function validateDepartment(_department: SelectOption<number>) {
  return _department.value !== -1;
}

function validateName(name: string) {
  return name.length > 0 && name.length <= 20;
}

function validateSurname(surname: string) {
  return surname.length > 0 && surname.length <= 20;
}

const UserEditDetails: FC<UserEditDetailsProps> = () => {
  const {
    userId = null,
    department = null,
    first_name = "",
    last_name = "",
  } = UseVerifyUser<{
    userId: number | null;
    department: DepartmentType | null;
    first_name: string;
    last_name: string;
  }>({
    userDataPolicies: [
      {
        dataPoint: "department",
      },
      {
        dataPoint: "first_name",
      },
      {
        dataPoint: "last_name",
      },
    ],
  });

  const showMessage = UseSystemMessage();

  const navigate = useNavigate();

  const [departments, setDepartments] = useState<SelectOptions<number>>([]);

  const getDepartments = useCallback(async () => {
    try {
      const data = await index({
        resource: "departments",
      });

      setDepartments(
        data.departments.map((department: DepartmentType) => ({
          value: department.id,
          label: department.name,
        }))
      );
    } catch (errors) {
      showMessage("error", errors);
    }
  }, [showMessage]);

  useEffect(() => {
    getDepartments();
  }, [getDepartments]);

  const {
    enteredValue: enteredDepartment,
    isInputValid: isInputDepartmentValid,
    isValueValid: isValueDeprtmentPasswordValid,
    changeHandler: departmentChangeHandler,
    blurHandler: departmentBlurHandler,
  } = useInput<SelectOption<number>>(
    { value: department === null ? -1 : department.id },
    validateDepartment
  );

  const {
    enteredValue: enteredFirstName,
    isInputValid: isInputFirstNameValid,
    isValueValid: isValueFirstNameValid,
    changeHandler: firstNameChangeHandler,
    blurHandler: firstNameBlurHandler,
  } = useInput<string>(first_name, validateName);

  const {
    enteredValue: enteredLastName,
    isInputValid: isInputLastNameValid,
    isValueValid: isValueLastNameValid,
    changeHandler: lastNameChangeHandler,
    blurHandler: lastNameBlurHandler,
  } = useInput<string>(last_name, validateSurname);

  useEffect(() => {
    if (first_name !== "") {
      firstNameChangeHandler(first_name);
    }
  }, [firstNameChangeHandler, first_name]);

  useEffect(() => {
    if (last_name !== "") {
      lastNameChangeHandler(last_name);
    }
  }, [lastNameChangeHandler, last_name]);

  useEffect(() => {
    console.log(department);

    if (department) {
      departmentChangeHandler({ value: department.id, label: department.name });
    }
  }, [department, departmentChangeHandler]);

  const sendUpdateData = async () => {
    const department = {
      name: enteredDepartment.label,
      id: enteredDepartment.value,
    };
    const body = {
      first_name: enteredFirstName,
      last_name: enteredLastName,
      department: department,
    };

    try {
      await update({
        resource: "users",
        entity: userId as number,
        body: body,
      });
      showMessage("success", "Details changed successfully.");
      navigate("/profile");
    } catch (errors) {
      showMessage("error", errors);
    }
  };

  const submitHandler = () => {
    if (
      isValueDeprtmentPasswordValid &&
      isValueFirstNameValid &&
      isValueLastNameValid
    ) {
      sendUpdateData();
    } else {
      departmentBlurHandler();
      firstNameBlurHandler();
      lastNameBlurHandler();
    }
  };

  return (
    <DashboardSubpageLayout title="Update User Details">
      <TextInput
        icon="1️⃣"
        value={enteredFirstName}
        isValid={isInputFirstNameValid}
        onChange={firstNameChangeHandler}
        onBlur={firstNameBlurHandler}
        id="firstname"
        label="First Name"
        placeholder="Please provide your first name"
      />

      <TextInput
        icon="2️⃣"
        value={enteredLastName}
        isValid={isInputLastNameValid}
        onChange={lastNameChangeHandler}
        onBlur={lastNameBlurHandler}
        id="lastname"
        label="Last Name"
        placeholder="Please provide your last name"
      />
      <Select
        value={enteredDepartment}
        isValid={isInputDepartmentValid}
        onChange={departmentChangeHandler}
        onBlur={departmentBlurHandler}
        icon="👥"
        id="department"
        placeholder="Please select your department"
        label="Department"
        options={departments}
      />
      <Button icon="➡️" buttonStyle="primary" onClick={submitHandler}>
        Apply
      </Button>
      <div data-testid={"UserEditDetials"} />
    </DashboardSubpageLayout>
    // <div className={styles.Interests} data-testid="Interests">
    //   Interests Component
    // </div>
  );
};

export default UserEditDetails;
