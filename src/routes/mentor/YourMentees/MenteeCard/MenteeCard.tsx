import React, { FC } from 'react';
import styles from './MenteeCard.module.scss';
import Button from '../../../../components/UI/Button/Button';
import BarChart from '../../../../components/UI/BarChart/BarChart'

//Probably need to pass mentor id along
interface MenteeProp {
    id : number
    firstname : string
    lastname : string
    completedGoal : number
    totalGoal: number
}

//Add a pie chart to show plans of action i guess
const MenteeCard : FC<MenteeProp> = (props) => {
    return (
        <div className={styles.MenteeCard} data-testid='MenteeCard'>    
            {`${props.firstname} ${props.lastname}`}
            <BarChart completedGoals={props.completedGoal} totalGoals={props.totalGoal}/>
            <div className={styles.ButtonFloat}>
                <Button href={"/learn/plans-of-action"} buttonStyle="primary" icon={"✔"}>
                    View Plan
                </Button>
            </div>
        </div>
    )
}

export default MenteeCard;

