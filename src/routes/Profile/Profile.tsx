import React, { FC, Fragment, useCallback, useContext, useEffect, useState } from "react";
import DashboardSubpageLayout from "../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import Tag from "../../components/UI/Tag/Tag";
import styles from "./Profile.module.scss";
import Title from "../../components/UI/Title/Title";
import Avatar from "../../components/UI/Avatar/Avatar";


interface ProfileProp {

}


const topicList = (topics : string[], titleText : string) => (
    <React.Fragment>
        <Title text={titleText} />
            {topics.map( (topic : string) => (
                <Tag key={topic}>
                    {topic}
                </Tag>
            ))}
    </React.Fragment>
);


const Profile: FC<ProfileProp> = () => {

    const isMentor = true;
    const isExpert = true;
    const alltopics = ["Trading", "Money", "Economy"];
    
    return (
        <DashboardSubpageLayout title='My Profile'>
            <div className = {styles.topContainer}>
                <div className={styles.leftContainer}>
                    <Avatar/> {/*Remove this whole top container (and right container styling) if we are not using images */}
                </div>
                <div className={styles.rightContainer}>
                    <Title text='Name'/>
                    <Tag>
                        John Smith
                    </Tag>
                    <Title text='Email'/>
                    <Tag>
                        <span style={{textTransform: 'none'}}>johnsmith@gmail.com</span>
                    </Tag>
                </div>
            </div>
            <Title text='Department'/>
            <Tag>
                Computer Science
            </Tag>

            <br></br>
            {isMentor && topicList(alltopics, 'Mentor Topics')}
            
            <br></br>
            {isExpert && topicList(alltopics, 'Expertise')}
            <div data-testid='Profile' />
        </DashboardSubpageLayout>
    )
}

export default Profile;