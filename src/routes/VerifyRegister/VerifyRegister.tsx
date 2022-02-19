import React from 'react';
import MainLayout from "../../layouts/MainLayout/MainLayout";
import styles from './VerifyRegister.module.scss';

function VerifyRegister() {
    return (
        <div>
            <MainLayout title="Register">
        </MainLayout>
        <h1 className={styles.h1}>We've sent you an email.</h1>
        <h2 className={styles.h2}>Please confirm your email by clicking the link provided.</h2>
        <h3 className={styles.h3}>Didn't recieve an email?</h3>
        <a className={styles.a} href="/dashboard">Resend</a>
        </div>
    );
}

export default VerifyRegister;