import React, { FC, Fragment, useContext } from "react";
import Header from "../../components/UI/Header/Header";
import Footer from "../../components/UI/Footer/Footer";
import styles from "./MainLayout.module.scss";
import ErrorMessagesContext from "../../store/ErrorMessagesContext";
import SystemMessage from "../../components/UI/SystemMessage/SystemMessage";

interface MainTemplateProps {
  children: React.ReactNode;
  title: string;
}

const MainLayout: FC<MainTemplateProps> = (props) => {
  // <div className={styles.MainTemplate} data-testid="MainTemplate">
  //   MainTemplate Component
  // </div>
  const errorsCtx = useContext(ErrorMessagesContext);


  const errors = errorsCtx.errors.map((error) => {
    return (
      <SystemMessage
        sort={"inline"}
        type={"warning"}
        description={error.message}
        visible={true}
        onClose={errorsCtx.removeErrorHandler.bind(null, error.id)}
      />
    );
  });

  return (
    <Fragment>
      <Header title={props.title} />
      <div className={styles.Errors}>{errors}</div>
      <div className={styles.ContentLayout}>{props.children}</div>
      <Footer />
      <div data-testid="MainLayout" />
    </Fragment>
  );
};

export default MainLayout;
