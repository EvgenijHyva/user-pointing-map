import Map from "ol/Map";
import { Owner } from '../../service/backend-response.types';

export type MapProps = {};

export interface IMap {
	map: Map;
}

export type MapState = {
	mapContext?: IMap;
}

export type PointFeature = { 
	owner: Owner, 
	label: string | null, 
	name: string, 
	comment: string | null,
	initial_point: string,
	created_at: string, 
	updated_at: string 
};