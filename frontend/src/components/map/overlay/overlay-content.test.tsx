import { render, screen } from '@testing-library/react';
import OverlayContent from './overlay-content';
import { PointFeature } from '../map-types';

const pointMockProps: PointFeature = {
  id: 10,
  owner: {
	id: 1,
    username: 'TestUser',
    first_name: 'Mock first name',
    last_name: 'Mock last name',
	age: 10,
	is_admin: false,
	is_active: true,
	color: "black"
  },
  label: 'Mock Label',
  name: 'Mock Name',
  initial_point: 'Mock point data',
  comment: 'Mock Comment',
  created_at: new Date().toString(),
  updated_at: new Date().toString(),
};

test('Overlay content testing', () => {
  render(<OverlayContent pointProps={pointMockProps}/>);
  expect(screen.getByText(`${pointMockProps.owner.username}`)).toBeInTheDocument();
  expect(screen.getByText(`${pointMockProps.label}`)).toBeInTheDocument();
  expect(screen.getByText(`${pointMockProps.name}`)).toBeInTheDocument();
  expect(screen.getByText(`${pointMockProps.created_at}`)).toBeInTheDocument();
  expect(screen.getByText(`${pointMockProps.updated_at}`)).toBeInTheDocument();
});

