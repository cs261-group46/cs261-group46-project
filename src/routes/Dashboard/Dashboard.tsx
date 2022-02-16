import React, { FC } from 'react';
import styles from './Dashboard.module.scss';
import MainLayout from "../../layouts/MainLayout/MainLayout";
import Button from "../../components/UI/Button/Button";

interface DashboardProps {}

const Dashboard: FC<DashboardProps> = () => (
    <MainLayout title={"Dashboard"}>
        <h1>Welcome back!</h1>

        <Button icon={"👤"} onClick={() => {}}>Your Profile</Button>

        <Button icon={"🔔"} onClick={() => {}}>All Notifications</Button>

        <Button icon={"📅"} onClick={() => {}}>Upcoming Events</Button>

        <Button icon={"💬"} onClick={() => {}}>Messages</Button>

        <Button icon={"⚙️"} onClick={() => {}}>Settings</Button>

        <Button icon={"👋"} onClick={() => {}}>Logout</Button>

        <h1>Your Learning</h1>

        <Button icon={"🔔"} onClick={() => {}}>Recent Notifications</Button>

        <Button icon={"👨‍🏫"} onClick={() => {}}>Your Mentor</Button>

        <Button icon={"📈"} onClick={() => {}}>Plans of Action</Button>

        <Button icon={"✏️"} onClick={() => {}}>Workshops</Button>

        <Button icon={"👥"} onClick={() => {}}>Group Sessions</Button>

        <Button icon={"💡"} onClick={() => {}}>Your Interests</Button>

        <h1>Your Mentoring</h1>

        <Button icon={"🔔"} onClick={() => {}}>Recent Notifications</Button>

        <Button icon={"🧑‍🎓"} onClick={() => {}}>Your Mentees</Button>

        <Button icon={"💪"} onClick={() => {}}>Your Skills</Button>

        <h1>Your Expertise</h1>

        <Button icon={"🔔"} onClick={() => {}}>Recent Notifications</Button>

        <Button icon={"✏"} onClick={() => {}}>Your Workshops</Button>

        <Button icon={"💪"} onClick={() => {}}>Your Fields of Expertise</Button>

        <div data-testid="Dashboard"/>
    </MainLayout>
);

export default Dashboard;
