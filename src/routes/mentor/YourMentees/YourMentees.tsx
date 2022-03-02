import React, { FC } from 'react';
import styles from './YourMentee.module.scss';
import MainLayout from '../../../layouts/MainLayout/MainLayout';
import Button from '../../../components/UI/Button/Button';
import UseLogin from '../../../hooks/UseLogin/UseLogin';
import useLogin from "../../../hooks/UseLogin/UseLogin";
import Title from '../../../components/UI/Title/Title';
import MenteeCard from './MenteeCard/MenteeCard';

interface YourMenteeProps {

}

const exampleMentees = [
    {
        firstname: "John",
        lastname: "Smith",
        completedGoal: 3,
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

    const currentMentee = 3; //TODO: get from database

    //TODO: get list of mentees from database, and if tehy dont have any return a different thingy
    const menteelist = exampleMentees.map( (mentee) => 
        <MenteeCard firstname={mentee.firstname} lastname={mentee.lastname} id={mentee.id} completedGoal={mentee.completedGoal} totalGoal={mentee.totalGoal}/> 
    );

    console.log(exampleMentees);
    return( 
        <MainLayout title='Your Mentees'>
            <Title text={`Current Mentees: ${currentMentee}`}/>
            <div>
                {menteelist}
            </div>
        <div data-testid='YourMentees' />
        </MainLayout>
    )
}

export default YourMentees;