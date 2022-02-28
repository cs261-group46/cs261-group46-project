import React, { FC, Fragment } from "react";
import Button from "../../../components/UI/Button/Button";
import MainLayout from "../MainLayout";
interface DashboardSubpageLayoutTemplateProps {
  children: React.ReactNode;
  title: string;
}

const DashboardSubpageLayout: FC<DashboardSubpageLayoutTemplateProps> = (
  props
) => (
  // <div className={styles.MainTemplate} data-testid="MainTemplate">
  //   MainTemplate Component
  // </div>
  <MainLayout title={props.title}>
    <Button href="/Dashboard">Dashboard</Button>
    {props.children}
  </MainLayout>
);

export default DashboardSubpageLayout;
