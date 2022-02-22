import React, { FC } from 'react';
// import styles from './MentorSignup.module.scss';
import MainLayout from '../../../layouts/MainLayout/MainLayout';
import MultiSelect from '../../../components/UI/FormInput/MultiSelect/MultiSelect';
import { MultiSelectOptions } from '../../../components/UI/FormInput/MultiSelect/MultiSelect.d';
import useInput from '../../../hooks/UseInput/UseInput';
import Button from '../../../components/UI/Button/Button';
import { useNavigate } from 'react-router-dom';
import TextInput from '../../../components/UI/FormInput/TextInput/TextInput';
import BigTextInput from '../../../components/UI/FormInput/BigTextInput/BigTextInput';

interface MentorSignupProps {}

const MentorSignup: FC<MentorSignupProps> = () => {
  const {
    isInputValid: isSkillsInputValid,
    isValueValid: isSkillsValueValid,
    changeHandler: skillsChangeHandler,
    blurHandler: skillsBlurHandler,
    enteredValue: skills,
  } = useInput<MultiSelectOptions<string>>(value => value.length > 0, []);

  const {
    isInputValid: isProfileInputValid,
    isValueValid: isProfileValueValid,
    changeHandler: profileChangeHandler,
    blurHandler: profileBlurHandler,
    enteredValue: profile,
  } = useInput<string>(() => true, '');

  let navigate = useNavigate();

  const registrationHandler = () => {
    if (isSkillsValueValid && isProfileValueValid) {
      // sendRegistrationData();
      navigate('/dashboard');
    }
  };

  return (
    <MainLayout title={'Sign up to be a Mentor'}>
      <MultiSelect
        id={'interests'}
        label={'What are you interested in mentoring colleagues on?'}
        isValid={isSkillsInputValid}
        value={skills}
        onChange={skillsChangeHandler}
        onBlur={skillsBlurHandler}
      />

      <BigTextInput
        id={'profile'}
        label={'Write a short profile about yourself, viewable by Mentors'}
        placeholder={'I can play Electric Guitar'}
        value={profile}
        isValid={isProfileInputValid}
        onChange={profileChangeHandler}
        onBlur={profileBlurHandler}
      />

      <Button icon='👑' onClick={registrationHandler} buttonStyle={'primary'}>
        Register
      </Button>

      <div data-testid='MentorSignup' />
    </MainLayout>
  );
};

export default MentorSignup;
