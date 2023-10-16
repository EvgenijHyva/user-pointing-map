import { render, screen } from '@testing-library/react';
import SignUpForm from './sigm-up-form';

test('SignUpForm component should be rendered with fields and button', () => {
  render(<SignUpForm />);
  expect(screen.getByTestId('sign-up-form')).toBeInTheDocument();
  expect(screen.getByText('Username')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Enter firstname')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Enter lastname')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Enter age')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
});

