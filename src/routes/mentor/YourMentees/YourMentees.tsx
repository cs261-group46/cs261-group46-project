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
        completedGoal: 4,
        totalGoal: 10,
        startDate: 1, //TODO, there is no date in the database
    },
    {
        firstname: "Kai",
        lastname: "Smith",
        completedGoal: 2,
        totalGoal: 4,
    }
]

const YourMentees: FC<YourMenteeProps> = () => {

    const currentMentee = 3; {/*TODO: get from database */}
    
    {/* Replace with MenteeCard */}
    const menteelist = exampleMentees.map( (mentee) => 
        <MenteeCard firstname={mentee.firstname} lastname={mentee.lastname}/> 
    );
    /* app/routes/api */
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