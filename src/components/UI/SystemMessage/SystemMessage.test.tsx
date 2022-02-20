import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SystemMessage from './SystemMessage';

describe('<SystemMessage />', () => {
  test('it should mount', () => {
    let visible = true;
    const setVisible = (newVisible: boolean) => visible = newVisible;
    render(<SystemMessage sort={"inline"} description={"test description"} type={"alert"} visible={visible} setVisible={setVisible}/>);
    
    const systemMessage = screen.getByTestId('SystemMessage');

    expect(systemMessage).toBeInTheDocument();
  });

  test('invisible popup should not mount', () => {
    let visible = false;
    const setVisible = (newVisible: boolean) => visible = newVisible;
    render(<SystemMessage sort={"inline"} description={"test description"} type={"alert"} visible={visible} setVisible={setVisible}/>);

    const tryFindSystemMessage = () => screen.getByTestId('SystemMessage');

    expect(tryFindSystemMessage).toThrow()
  });
});
