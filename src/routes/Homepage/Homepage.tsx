import React, { FC } from 'react';
import styles from './Homepage.module.scss';
import {Link} from "react-router-dom";

interface HomepageProps {}

const Homepage: FC<HomepageProps> = () => (
    <div className={styles.Homepage} data-testid="Homepage">
        <h1>Welcome to SkillShare!</h1>
        <div className={styles.Buttons}>
            <Link to="/auth/register">Register</Link>
            <Link to="/auth/login">Login</Link>
        </div>
    </div>
);

export default Homepage;
