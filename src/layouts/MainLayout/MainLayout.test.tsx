import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MainLayout from './MainLayout';

// describe('<MainTemplate />', () => {
//   test('it should mount', () => {
//     render(<MainLayout />);
//
//     const mainTemplate = screen.getByTestId('MainTemplate');
//
//     expect(mainTemplate).toBeInTheDocument();
//   });
// });