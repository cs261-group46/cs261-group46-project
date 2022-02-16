import React, { FC } from 'react';
import styles from './Dashboard.module.scss';
import MainLayout from "../../layouts/MainLayout/MainLayout";
import Button from "../../components/UI/Button/Button";

interface DashboardProps {}

const Dashboard: FC<DashboardProps> = () => (
    <MainLayout title={"Dashboard"}>
        <h1>Welcome back!</h1>

        <Button icon={"🧍"} onClick={() => {}}>
            <p>Your Profile</p>
        </Button>



        <div data-testid="Dashboard"/>
    </MainLayout>
);

export default Dashboard;
