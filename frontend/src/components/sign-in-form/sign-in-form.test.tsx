import { render, screen } from '@testing-library/react';
import SignInForm from './sign-in-form';

test('SignInForm component should be rendered with fields and button', () => {
  render(<SignInForm />);
  expect(screen.getByTestId('sign-in-form')).toBeInTheDocument();
  expect(screen.getByText('Username')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
});
