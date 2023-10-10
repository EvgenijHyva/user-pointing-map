import Map from "ol/Map";
import { Owner } from '../../utils/service/backend-response.types';

export type MapProps = {};

export interface IMap {
	map: Map;
}

export type MapState = {
	mapContext?: IMap;
}

export type PointFeature = { owner: Owner, label: string | null, name: string, initial_point: string };