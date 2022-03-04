import React, { FC, Fragment, useCallback, useContext, useEffect, useState } from "react";
import DashboardSubpageLayout from "../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import Tag from "../../components/UI/Tag/Tag";
import styles from "./Profile.module.scss";
import Title from "../../components/UI/Title/Title";


interface ProfileProp {

}


const alltopics = ["Trading", "Money", "Economy"];

const topicList = (topics : string[], titleText : string) => (
    <React.Fragment>
        <Title text={titleText} />
            {topics.map( (topic : string) => (
                <Tag>
                    {topic}
                </Tag>
            ))}
    </React.Fragment>
);


const Profile: FC<ProfileProp> = () => {

    const isMentor = true;
    const isExpert = true;

    return (
        <DashboardSubpageLayout title={"My Profile"}>
            <div className = {styles.topContainer}>
                <div className={styles.leftContainer}>
                    profile pic goes here 
                </div>
                <div className={styles.rightContainer}>
                    <Title text="Name"/>
                    <Tag>
                        John Smith
                    </Tag>
                    <Title text="Email"/>
                    <Tag>
                        <span style={{textTransform: "none"}}>johnsmith@gmail.com</span>
                    </Tag>
                </div>
            </div>
            <Title text="Department"/>
            <Tag>
                Computer Science
            </Tag>

            <br></br>
            {isMentor && topicList(alltopics, "Mentor Topics")}
            
            <br></br>
            {isExpert && topicList(alltopics, "Expertise")}

        </DashboardSubpageLayout>
    )
}

export default Profile;