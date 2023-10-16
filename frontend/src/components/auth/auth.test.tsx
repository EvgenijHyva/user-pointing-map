import AuthComponent from './auth';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

test('Auth container should appear', () => {
  render(
	<MemoryRouter>
  		<AuthComponent />
	</MemoryRouter>
  );
  expect(screen.getByTestId('auth-container')).toBeInTheDocument();
  expect(screen.getByTestId('sign-in-form')).toBeInTheDocument();
  expect(screen.getByTestId('sign-up-form')).toBeInTheDocument();
});

