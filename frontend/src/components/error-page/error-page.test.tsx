import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ErrorPage from './error-page';

test('Error page should appear', () => {
  render(
	<MemoryRouter>
  		<ErrorPage />
	</MemoryRouter>
  );
  expect(screen.getByTestId('error-page')).toBeInTheDocument();
  expect(screen.getByText("Sorry, an unexpected error has occurred.")).toBeInTheDocument();
});

