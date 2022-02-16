import React, { FC } from 'react';
import styles from './Dashboard.module.scss';
import MainLayout from "../../layouts/MainLayout/MainLayout";

interface DashboardProps {}

const Dashboard: FC<DashboardProps> = () => (
    <MainLayout title={"Dashboard"}>


        <div data-testid="Dashboard"/>
    </MainLayout>
);

export default Dashboard;
