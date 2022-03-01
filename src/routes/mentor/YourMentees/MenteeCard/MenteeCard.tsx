import React, { FC } from 'react';
import styles from './MenteeCard.module.scss';
import MainLayout from '../../../../layouts/MainLayout/MainLayout';
import Button from '../../../../components/UI/Button/Button';
import UseLogin from '../../../../hooks/UseLogin/UseLogin';
import useLogin from "../../../../hooks/UseLogin/UseLogin";

interface MenteeProp {

}

const MenteeCard : FC<MenteeProp> = (props) => {
    return (
        <div data-testid='MenteeCard'>
            
        </div>
    )
}

export default MenteeCard;

