import React, { FC } from 'react';
import styles from './Register.module.scss';
import MainLayout from "../../layouts/MainLayout/MainLayout";
interface RegisterProps {}

const Register: FC<RegisterProps> = () => (
  // <div className={styles.Register} data-testid="Register">
  //   Register Page
  // </div>
    <MainLayout title="Register">
        Some content
    </MainLayout>
);

export default Register;
