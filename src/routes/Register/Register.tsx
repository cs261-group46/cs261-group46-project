import React, { FC } from 'react';
// import styles from './Register.module.scss';
import MainLayout from "../../layouts/MainLayout/MainLayout";
import TextInput from "../../components/UI/FormInput/TextInput/TextInput";
import PasswordInput from "../../components/Register/PasswordInput/PasswordInput";
import Select from "../../components/UI/FormInput/Select/Select";
import Button from "../../components/UI/Button/Button";
interface RegisterProps {}

const DUMMY_DEPARTMENTS = [{option_id: "1", option: "Department 1"}]

const Register: FC<RegisterProps> = () => (
  // <div className={styles.Register} data-testid="Register">
  //   Register Page
  // </div>
    <MainLayout title="Register">
        <TextInput icon="✉️" id="email" label="Email" placeholder="Please provide your email address"/>
        <PasswordInput/>
        <TextInput icon="🔒️" type="password" id="password_r" label="Repeat Password" placeholder="Please provide your password again"/>
        <Select icon="👥" id="department" placeholder="Please select your department" label="Department" options={DUMMY_DEPARTMENTS}/>
        <Button icon="👑">Register</Button>
    </MainLayout>
);

export default Register;
