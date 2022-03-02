import React, { FC } from 'react';
import styles from './MenteeCard.module.scss';
import Button from '../../../../components/UI/Button/Button';
import { Link } from "react-router-dom";
import BarChart from '../../../../components/UI/BarChart/BarChart';

//Probably need to pass mentor id along
interface MenteeProp {
    id : number
    firstname : string
    lastname : string
    completedGoal : number
    totalGoal: number
}

const MenteeCard : FC<MenteeProp> = (props) => {

    //TODO: Given an id, lead to the correct plan of action.
    //TODO: have button send to meeting link instead of dashboard
    return (
        <Link className={styles.MenteeCard} data-testid='MenteeCard' to="/learn/plans-of-action">    
            {`${props.firstname} ${props.lastname}`}
            <BarChart completedGoals={props.completedGoal} totalGoals={props.totalGoal}/>
            <div className={styles.ButtonFloat}>
                <Button href={"/dashboard"} buttonStyle="primary" icon={"👥"}> 
                    View Meetings
                </Button>
            </div>
        </Link>
    )
}

export default MenteeCard;

