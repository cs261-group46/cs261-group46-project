import React, {useState} from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MultiSelect from './MultiSelect';

describe('<MultiSelect />', () => {
  test('it should mount', () => {
    const [options, setOptions] = useState<string[]>([]);

    render(<MultiSelect options={options} setOptions={setOptions}/>);
    
    const multiSelect = screen.getByTestId('MultiSelect');

    expect(multiSelect).toBeInTheDocument();
  });
});