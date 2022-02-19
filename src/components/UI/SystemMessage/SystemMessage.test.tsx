import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SystemMessage from './SystemMessage';

describe('<SystemMessage />', () => {
  test('it should mount', () => {
    render(<SystemMessage sort={"popup"} description={"test description"} type={"alert"} visible={true}/>);
    
    const systemMessage = screen.getByTestId('SystemMessage');

    expect(systemMessage).toBeInTheDocument();
  });
});
