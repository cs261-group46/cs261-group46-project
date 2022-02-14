import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UseInput from './UseInput';

// useInput is a hook and so isnt tested like a normal elemtn
// TODO: useInput tests