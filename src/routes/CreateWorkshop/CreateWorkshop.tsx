import React, { FC } from 'react';
import styles from './CreateWorkshop.module.scss';

interface CreateWorkshopProps {}

const CreateWorkshop: FC<CreateWorkshopProps> = () => (
  <div className={styles.CreateWorkshop} data-testid="CreateWorkshop">
    CreateWorkshop Component
  </div>
);

export default CreateWorkshop;
