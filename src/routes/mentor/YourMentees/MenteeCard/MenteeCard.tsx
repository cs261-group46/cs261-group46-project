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
        <div className={styles.MenteeCard} data-testid='MenteeCard'>    
            {`${props.firstname} ${props.lastname}`}
            <BarChart completedGoals={props.completedGoal} totalGoals={props.totalGoal}/>
            <div className={styles.ButtonFloatLeft}>
                <Button href={"/dashboard"} buttonStyle="primary" icon={"👥"}> 
                    Meetings 
                </Button>
            </div>
            <div className={styles.ButtonFloatRight}>
                <Button href={"/learn/plans-of-action"} icon={"✓"}> 
                    <span style={{marginLeft: "2px", marginRight: "2px"}}>View Plan</span>
                </Button>
            </div>
        </div>
    )
}

export default MenteeCard;

