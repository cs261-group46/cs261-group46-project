import React, { FC } from 'react';
import styles from './Register.module.scss';

interface RegisterProps {}

const Register: FC<RegisterProps> = () => (
  <div className={styles.Register} data-testid="Register">
    <p>Register Form</p>
  </div>
);

export default Register;
