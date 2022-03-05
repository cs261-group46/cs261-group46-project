import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Avatar from './Avatar';
import { BrowserRouter } from 'react-router-dom';

describe('<Avatar />', () => {
    test('it should mount', () => {
      render(<BrowserRouter><Avatar /></BrowserRouter>);
      
      const avatar = screen.getByTestId('Avatar');
  
      expect(avatar).toBeInTheDocument();
    });
  });