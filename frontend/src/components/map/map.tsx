import { toast } from 'react-toastify';
import React, { useEffect, useRef, useState } from 'react';
import BackendService from '../../utils/service/service';
import { MapState, MapProps, IMap } from "./map-types";
// Openlayers
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import OSM from "ol/source/OSM";
import TileLayer from 'ol/layer/Tile';
// styles
import "./map.styles.css";
import "ol/ol.css";
import 'react-toastify/dist/ReactToastify.css';
import { View } from 'ol';
import { PointResponseData } from '../../utils/service/backend-response.types';
import { AxiosError } from 'axios';

export const MapContext = React.createContext<MapState | null>(null);


function MapComponent({ zoom = 1 }: { zoom?: number }): JSX.Element {
	const backend = new BackendService();
	const ref = useRef<HTMLDivElement | null>(null);
	const mapRef = useRef<Map | null>(null);
	const [locations, setLocations] = useState<PointResponseData[]>([]);

	useEffect(() => {
		if (ref.current && !mapRef.current) {
		mapRef.current = new Map({
			layers: [
				new TileLayer({ source: new OSM() })
			],
			view: new View({ 
				center: [0, 0], 
				zoom: 1 
			}),
			target: ref.current
		});
		}
	}, [ref, mapRef]);

	useEffect(() => {
		async function fetchData() {
			try {
				const result = await backend.getPoints();
				setLocations(result);
			} catch (error) {
				console.log(error)
				toast((error as AxiosError).message)
			}
		}
  		fetchData();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		mapRef.current?.getView().setZoom(zoom); // Use optional chaining here
	}, [zoom]);

	return (
		<div ref={ref} id='map'>
			
		</div>
	);
}

//*/

export default MapComponent;