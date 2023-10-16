import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from "react-router-dom"

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

test('renders react app', () => {
  render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
  );
  const app = screen.getByTestId("App");
  expect(app).toBeInTheDocument();
});
