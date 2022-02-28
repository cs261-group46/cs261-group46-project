import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PieView from './PieView';

describe('<PieView />', () => {
  test('it should mount', () => {
    render(<PieView segments={[
      {fr: 2, fill: "#07A417", label: "Active"},
      {fr: 1, fill: "#393838", label: "Completed"},
      {fr: 1, fill: "#FF0000", label: "Unknown"}]}/>);
    
    const pieView = screen.getByTestId('PieView');

    expect(pieView).toBeInTheDocument();
  });

  it('should contain the labels', () => {
    render(<PieView segments={[
      {fr: 2, fill: "#07A417", label: "Active"},
      {fr: 1, fill: "#393838", label: "Completed"},
      {fr: 1, fill: "#FF0000", label: "Unknown"}]}/>);


    const pieView = screen.getByTestId('PieView');

    expect(pieView).toHaveTextContent("Active");
    expect(pieView).toHaveTextContent("Completed");
    expect(pieView).toHaveTextContent("Unknown");
  })
});