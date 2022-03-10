import React, { FC, Fragment, useContext } from "react";
import Header from "../../components/UI/Header/Header";
import Footer from "../../components/UI/Footer/Footer";
import styles from "./MainLayout.module.scss";
import SystemMessagesContext from "../../store/SystemMessagesContext";
import SystemMessage from "../../components/UI/SystemMessage/SystemMessage";

interface MainTemplateProps {
  children: React.ReactNode;
  title: string;
}

const MainLayout: FC<MainTemplateProps> = (props) => {
  const systemMessageCtx = useContext(SystemMessagesContext);

  const messages = systemMessageCtx.messages.map(({ id, message, type }, i) => {
    return (
      <SystemMessage
        key={i}
        sort={"inline"}
        type={type === "error" ? "warning" : "success"}
        description={message}
        visible={true}
        onClose={systemMessageCtx.removeMessageHandler.bind(null, id)}
      />
    );
  });

  return (
    <Fragment>
      <Header title={props.title} />
      <div className={styles.Errors}>{messages}</div>
      <div className={styles.ContentLayout}>{props.children}</div>
      <Footer />
      <div data-testid="MainLayout" />
    </Fragment>
  );
};

export default MainLayout;
