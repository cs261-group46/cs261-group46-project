import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MainLayout from './MainLayout';

describe('<MainTemplate />', () => {
  test('it should mount', () => {
    render(<MainLayout title={"Test Layout"}><div>test content</div></MainLayout>);

    const mainTemplate = screen.getByTestId('MainLayout');

    expect(mainTemplate).toBeInTheDocument();
  });
});