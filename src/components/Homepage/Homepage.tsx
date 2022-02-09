import React, { FC } from 'react';
import styles from './Homepage.module.scss';

interface HomepageProps {}

const Homepage: FC<HomepageProps> = () => (
    <div className={styles.Homepage} data-testid="Homepage">
        <h1>Welcome to SkillShare!</h1>
        <div className={styles.Buttons}>
            <a href="#">Register</a>
            <a href="#">Login</a>
        </div>
    </div>
);

export default Homepage;
