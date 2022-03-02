import React, { FC } from 'react';
import Title from '../../components/UI/Title/Title';
import Card from '../../components/UI/Card/Card';
import MainLayout from '../../layouts/MainLayout/MainLayout';

import styles from './PlansOfAction.module.scss';

interface PlansOfActionProps {
  milestones: string[];
}

const PlansOfAction: FC<PlansOfActionProps> = () => (
  <MainLayout title={'Plans of action'}>
    <Title text={`📈 Active`} />
    <Card>Test</Card>
    <Title text={`🏆 Completed`} />
    <Card>Test</Card>
    <div data-testid='PlansOfAction' />
  </MainLayout>
);

export default PlansOfAction;
