import React, { FC } from 'react';
import styles from './YourMentee.module.scss';
import MainLayout from '../../../layouts/MainLayout/MainLayout';
import Button from '../../../components/UI/Button/Button';
import UseLogin from '../../../hooks/UseLogin/UseLogin';
import useLogin from "../../../hooks/UseLogin/UseLogin";

interface YourMenteeProps {

}

const exampleMentees = [
    {
        name: "John",
        completedGoal: 4,
        totalGoal: 10, 
    },
    {
        name: "Kai",
        completedGoal: 2,
        totalGoal: 4,
    }
]

const YourMentees: FC<YourMenteeProps> = () => {

    const menteelist = exampleMentees.map( (mentee) => 
        <div>
            <h1>{mentee.name}</h1>
            {mentee.completedGoal} / {mentee.totalGoal} {/*TODO: just use pie chart instead */}
        </div>
    );
    /* app/routes/api */
    console.log(exampleMentees);
    return( 
        <MainLayout title='Your Mentees'>

            <div>
                {menteelist}
            </div>
        <div data-testid='YourMentees' />
        </MainLayout>
    )
}

export default YourMentees;