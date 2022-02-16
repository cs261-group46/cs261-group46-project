import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MultiSelect from './MultiSelect';
import {MultiSelectOptions} from "./MultiSelect.d"

describe('<MultiSelect />', () => {
  test('it should mount', () => {
    let value:MultiSelectOptions<string> = [{value: "test", label: "test"}]
    const setValue = (newValue) => {value = newValue};

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