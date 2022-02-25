import React from "react";
import HelperLink from "../../../../components/UI/HelperLink/HelperLink";
import MainLayout from "../../../../layouts/MainLayout/MainLayout";
import styles from "./VerifyEmail.module.scss";

function VerifyEmail() {
  const resendHandler = () => {
    // TODO : Send a request to re-verify
  };

  // onClick?: () => void;
  // href?: string;
  // description: string;
  // linkText: string;

  return (
    <MainLayout title="Register">
      <div className={styles.VerifyEmail}>
        <h1>We've sent you an email.</h1>
        <h2>Please confirm your email by clicking the link provided.</h2>

        <HelperLink
          onClick={resendHandler}
          description="Didn't receive an email?"
          linkText="Resend"
        />
      </div>
    </MainLayout>
  );
}

export default VerifyEmail;
