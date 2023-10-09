import Map from "ol/Map";

export type MapProps = {};

export interface IMap {
	map: Map;
}

export type MapState = {
	mapContext?: IMap;
}