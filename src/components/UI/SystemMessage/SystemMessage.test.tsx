import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SystemMessage from './SystemMessage';

describe('<SystemMessage />', () => {
  test('it should mount', () => {
    render(<SystemMessage sort={"popup"} description={"test description"} type={"alert"} onClose={function (): void {
      throw new Error('Function not implemented.');
    } }/>);
    
    const systemMessage = screen.getByTestId('SystemMessage');

    expect(systemMessage).toBeInTheDocument();
  });
});
