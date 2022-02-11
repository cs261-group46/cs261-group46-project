import React, { FC, Fragment} from 'react';
import styles from './MainTemplate.module.scss';
import Header from "../../components/UI/Header/Header";

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
    </Fragment>
);

export default MainLayout;
