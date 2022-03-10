import React, { FC } from "react";
import Button from "../../../components/UI/Button/Button";
import MainLayout from "../MainLayout";
import styles from "./DashboardSubpageLayout.module.scss";
interface DashboardSubpageLayoutTemplateProps {
  children: React.ReactNode;
  title: string;
  dashboardSection: "#home" | "#learning" | "#mentoring" | "#expertise";
}

const DashboardSubpageLayout: FC<DashboardSubpageLayoutTemplateProps> = (
  props
) => (
  // <div className={styles.MainTemplate} data-testid="MainTemplate">
  //   MainTemplate Component
  // </div>
  <MainLayout title={props.title}>
    <Button
      className={styles.HomeButton}
      href={`/dashboard${props.dashboardSection}`}
      icon="🏠"
    >
      Dashboard
    </Button>
    {props.children}
  </MainLayout>
);

export default DashboardSubpageLayout;
