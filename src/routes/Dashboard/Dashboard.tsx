import React, { FC, Fragment } from 'react';
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

        {/* if in this branch */}
        {false ? <Fragment>
                <Button icon={"🔔"} onClick={() => {}}>Recent Notifications</Button>

                <Button href={"/learning/mentor"} icon={"👨‍🏫"} onClick={() => {}}>Your Mentor</Button>

                <Button href={"/learning/plansofaction"} icon={"📈"} onClick={() => {}}>Plans of Action</Button>

                <Button href={"/workshops"} icon={"✏️"} onClick={() => {}}>Workshops</Button>

                <Button href={"/workshops"} icon={"👥"} onClick={() => {}}>Group Sessions</Button>

                <Button href={"/learning/interests"} icon={"💡"} onClick={() => {}}>Your Interests</Button>
            </Fragment>
            // else if not
            : <div className={styles.signup}>
                <Title text="You're not currently a mentee!"/>
                <Button href="learning/onboarding" buttonStyle='primary'>Sign up!</Button>
            </div>
        }

        <Title text={"Your Mentoring"}/>

        {/* if in this branch */}
        {false ? <Fragment>
                <Button icon={"🔔"} onClick={() => {}}>Recent Notifications</Button>

                <Button href={"/mentoring/mentees"} icon={"🧑‍🎓"} onClick={() => {}}>Your Mentees</Button>

                <Button href={"/mentoring/skills"} icon={"💪"} onClick={() => {}}>Your Skills</Button>
            </Fragment>
            // else if not
            : <div className={styles.signup}>
                <Title text="You're not currently a mentor!"/>
                <Button href="mentoring/onboarding" buttonStyle='primary'>Sign up!</Button>
            </div>
        }

        <Title text={"Your Expertise"}/>

        {/* if in this branch */}
        {false ? <Fragment>
                <Button icon={"🔔"} onClick={() => {}}>Recent Notifications</Button>

                <Button href={"/workshops"} icon={"✏"} onClick={() => {}}>Your Workshops</Button>

                <Button href={"/experts/skills"} icon={"💪"} onClick={() => {}}>Your Fields of Expertise</Button>
            </Fragment>
            // else if not
            : <div className={styles.signup}>
                <Title text="You're not currently an expert!"/>
                <Button href="experts/onboarding" buttonStyle='primary'>Sign up!</Button>
            </div>
        }


        <div data-testid="Dashboard"/>
    </MainLayout>
);

export default Dashboard;
