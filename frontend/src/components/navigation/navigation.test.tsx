import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Nav from '../nav/nav';
import MainPage from '../main-page/main-page';

test('Navbar should appear', () => {
  render(
	<MemoryRouter>
		<Nav />
	</MemoryRouter>
  );
  expect(screen.getByText('User Pointing Map')).toBeInTheDocument();
  expect(screen.getByText('Login/Register')).toBeInTheDocument();
  expect(screen.getByTestId('PublicIcon')).toBeInTheDocument();
});

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

test('Map should appear', () => {
	render(
		<MemoryRouter>
			<MainPage />
		</MemoryRouter>
  	);
	expect(screen.getByTestId('Map-component')).toBeInTheDocument();
});