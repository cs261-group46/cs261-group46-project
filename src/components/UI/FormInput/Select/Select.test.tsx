import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Select from './Select';

describe('<Select />', () => {
  test('it should mount', () => {
    render(<Select id={"test"} label={"test"} placeholder={"test"} options={[{id: "test", label: "test"}]} onChange={() => {}} onBlur={() => {}} isValid={true} value={undefined}/>);
    
    const select = screen.getByTestId('Select');

    expect(select).toBeInTheDocument();
  });
});