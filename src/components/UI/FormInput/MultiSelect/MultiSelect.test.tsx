import React, {useState} from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MultiSelect from './MultiSelect';

describe('<MultiSelect />', () => {
  let [value, setValue] = useState<{label: string, value: number}[]>([]);

  test('it should mount', () => {

    render(
        <MultiSelect
            icon='💪'
            id='expertise'
            label='Fields of Expertise'
            value={value}
            isValid={true}
            onChange={setValue}
            onBlur={() => {}}
            searchPromise={(search) => {
             return new Promise(resolve => resolve([
               {label: "test1", value: 1},
               {label: "test2", value: 2}
             ]))
            }}
        />
    );

    const multiSelect = screen.getByTestId('MultiSelect');

    expect(multiSelect).toBeInTheDocument();
  });
});