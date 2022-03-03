import React, { FC } from 'react';
import styles from "./YourMentees.module.scss";
import MainLayout from '../../../layouts/MainLayout/MainLayout';
import UseLogin from '../../../hooks/UseLogin/UseLogin';
import Title from '../../../components/UI/Title/Title';
import MenteeCard from './MenteeCard/MenteeCard';

interface YourMenteeProps {

}

const exampleMentees = [
    {
        firstname: "John",
        lastname: "Smith",
        completedGoal: 10,
        totalGoal: 10,
        id: 4
    },
    {
        firstname: "Kai",
        lastname: "Smith",
        completedGoal: 2,
        totalGoal: 7,
        id: 5
    },
    {
        firstname: "Amy",
        lastname: "Smith",
        completedGoal: 6,
        totalGoal: 10,
        id: 6
    }
]

const YourMentees: FC<YourMenteeProps> = () => {

    const menteeNum = exampleMentees.length; //TODO: get from database

    //TODO: get list of mentees from database, and if they dont have any return a different message (systemmessage?)
    const menteelist = exampleMentees.map( (mentee) =>
        <React.Fragment key={mentee.id}> 
            <MenteeCard firstname={mentee.firstname} lastname={mentee.lastname} id={mentee.id} completedGoal={mentee.completedGoal} totalGoal={mentee.totalGoal}/> 
        </React.Fragment>
    );

    console.log(menteelist)
    return( 
        <MainLayout title='Your Mentees'>
            <Title text={`Current Mentees: ${menteeNum}`}/>
            <div className = {styles.YourMentees}> 
                {menteeNum === 0 ? "You currently don't have any mentees" : menteelist}
            </div>
        <div data-testid='YourMentees' />
        </MainLayout>
    )
}

export default YourMentees;