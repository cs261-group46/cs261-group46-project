import React, { FC } from 'react';
import styles from './MeetingCreate.module.scss';
import MainLayout from "../../../layouts/MainLayout/MainLayout";
import Title from "../../../components/UI/Title/Title";

interface MeetingCreateProps {}

const MeetingCreate: FC<MeetingCreateProps> = () => (
  <MainLayout title={"Create a Meeting"}>
    <Title text={"With: <name>"}/>
  </MainLayout>
);

export default MeetingCreate;
