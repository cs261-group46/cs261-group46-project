import React, { FC } from 'react';
import styles from './MenteeCard.module.scss';
import MainLayout from '../../../../layouts/MainLayout/MainLayout';
import Button from '../../../../components/UI/Button/Button';
import UseLogin from '../../../../hooks/UseLogin/UseLogin';
import useLogin from "../../../../hooks/UseLogin/UseLogin";


//Probably need to pass mentor id along
interface MenteeProp {
    firstname : string
    lastname : string
}

const MenteeCard : FC<MenteeProp> = (props) => {
    return (
        <div className={styles.MenteeCard} data-testid='MenteeCard'>
            {`${props.firstname} ${props.lastname}`}
            <div className={styles.ButtonFloat}>
                <Button href={"/learn/plans-of-action"} buttonStyle="primary" icon={"✔"}>
                    View Plan
                </Button>
            </div>
        </div>
    )
}

export default MenteeCard;

