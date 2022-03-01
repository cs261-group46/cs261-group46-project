import React, { FC } from 'react';
import styles from './EditPlansOfAction.module.scss';
import MainLayout from "../../../layouts/MainLayout/MainLayout";

interface EditPlansOfActionProps {}

const EditPlansOfAction: FC<EditPlansOfActionProps> = () => (
    <MainLayout title={"Set Plans of Action"}>
        <div className={styles.EditPlansOfAction} data-testid="EditPlansOfAction">
        </div>
    </MainLayout>
);

export default EditPlansOfAction;
