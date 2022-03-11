import React, { FC } from "react";
import MainLayout from "../MainLayout";
import DashboardNavbar from "../../../routes/Dashboard/DashboardNavbar";
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
    {props.children}
    <DashboardNavbar />
  </MainLayout>
);

export default DashboardSubpageLayout;
