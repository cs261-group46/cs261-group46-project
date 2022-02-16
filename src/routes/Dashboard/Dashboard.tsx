import React, { FC } from 'react';
import styles from './Dashboard.module.scss';
import MainLayout from "../../layouts/MainLayout/MainLayout";
import Button from "../../components/UI/Button/Button";
import Title from '../../components/UI/Title/Title';

interface DashboardProps {}

const Dashboard: FC<DashboardProps> = () => (
    <MainLayout title={"Dashboard"}>
        <Title text={"Welcome back!"}/>

        <Button href={"/profile"} icon={"👤"} onClick={() => {}}><p style={{textDecoration: "none", display: "inline-block"}}>Your Profile</p></Button>

        <Button icon={"🔔"} onClick={() => {}}>All Notifications</Button>

        <Button href={"/workshops"} icon={"📅"} onClick={() => {}}>Upcoming Events</Button>

        <Button icon={"💬"} onClick={() => {}}>Messages</Button>

        <Button href={"/settings"} icon={"⚙️"} onClick={() => {}}>Settings</Button>

        <Button icon={"👋"} onClick={() => {}}>Logout</Button>

        <Title text={"Your Learning"}/>

        <Button icon={"🔔"} onClick={() => {}}>Recent Notifications</Button>

        <Button href={"/learning/mentor"} icon={"👨‍🏫"} onClick={() => {}}>Your Mentor</Button>

        <Button href={"/learning/plansofaction"} icon={"📈"} onClick={() => {}}>Plans of Action</Button>

        <Button href={"/workshops"} icon={"✏️"} onClick={() => {}}>Workshops</Button>

        <Button href={"/workshops"} icon={"👥"} onClick={() => {}}>Group Sessions</Button>

        <Button href={"/learning/interests"} icon={"💡"} onClick={() => {}}>Your Interests</Button>

        <Title text={"Your Mentoring"}/>

        <Button icon={"🔔"} onClick={() => {}}>Recent Notifications</Button>

        <Button href={"/mentoring/mentees"} icon={"🧑‍🎓"} onClick={() => {}}>Your Mentees</Button>

        <Button href={"/mentoring/skills"} icon={"💪"} onClick={() => {}}>Your Skills</Button>

        <Title text={"Your Expertise"}/>

        <Button icon={"🔔"} onClick={() => {}}>Recent Notifications</Button>

        <Button href={"/workshops"} icon={"✏"} onClick={() => {}}>Your Workshops</Button>

        <Button href={"/"} icon={"💪"} onClick={() => {}}>Your Fields of Expertise</Button>

        <div data-testid="Dashboard"/>
    </MainLayout>
);

export default Dashboard;
