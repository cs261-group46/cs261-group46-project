import React, { FC } from 'react';
// import styles from './MentorSignup.module.scss';
import MainLayout from '../../../layouts/MainLayout/MainLayout';
import SearchSelect from '../../../components/UI/FormInput/SearchSelect/SearchSelect';
import { MultiSelectOptions } from '../../../components/UI/FormInput/SearchSelect/SearchSelect.d';
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

  const {
    isInputValid: isCapacityInputValid,
    isValueValid: isCapacityValueValid,
    changeHandler: capacityChangeHandler,
    blurHandler: capacityBlurHandler,
    enteredValue: capacity,
  } = useInput<string>(() => true, '');

  let navigate = useNavigate();

  const registrationHandler = () => {
    console.log(skills, profile, capacity);
    if (isSkillsValueValid && isProfileValueValid && isCapacityValueValid) {
      // sendRegistrationData();
      navigate('/dashboard');
    }
  };

  return (
    <MainLayout title={'Sign up to be a Mentor'}>
      <SearchSelect
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

      <TextInput
        id={'capacity'}
        label={'How many mentees do you want?'}
        placeholder={'e.g. 5'}
        value={capacity}
        type={'number'}
        isValid={isCapacityInputValid}
        onChange={capacityChangeHandler}
        onBlur={capacityBlurHandler}
      />

      <Button icon='👑' onClick={registrationHandler} buttonStyle={'primary'}>
        Register
      </Button>

      <div data-testid='MentorSignup' />
    </MainLayout>
  );
};

export default MentorSignup;
