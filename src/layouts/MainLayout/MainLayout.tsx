import React, { FC, Fragment} from 'react';
import Header from "../../components/UI/Header/Header";
import Footer from "../../components/UI/Footer/Footer";

interface MainTemplateProps {
    children: React.ReactNode
    title: string
}

const MainLayout: FC<MainTemplateProps> = (props) => (
  // <div className={styles.MainTemplate} data-testid="MainTemplate">
  //   MainTemplate Component
  // </div>
    <Fragment>
        <Header title={props.title} />
        {props.children}
        <Footer/>
        <div data-testid="MainLayout"/>
    </Fragment>
);

export default MainLayout;
