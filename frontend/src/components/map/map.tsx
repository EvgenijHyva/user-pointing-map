import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import BackendService from '../../utils/service/service';
import { PointResponseData } from '../../utils/service/backend-response.types';
import { MapState, MapProps, IMap, PointFeature } from "./map-types";
// Openlayers
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Map from 'ol/Map';
import { View } from 'ol';
import OSM from "ol/source/OSM";
import TileLayer from 'ol/layer/Tile';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { transform } from 'ol/proj';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Circle from 'ol/style/Circle';
import Select, { SelectEvent } from "ol/interaction/Select";
import { pointerMove } from 'ol/events/condition';
import Overlay from 'ol/Overlay';
// styles
import "./map.styles.css";
import "ol/ol.css";
import 'react-toastify/dist/ReactToastify.css';

export const MapContext = React.createContext<MapState | null>(null);


function MapComponent({ zoom = 3 }: { zoom?: number }): JSX.Element {
	const ref = useRef<HTMLDivElement | null>(null);
	const refOverlay = useRef<HTMLDivElement | null>(null);
	const overlayRef = useRef<Overlay | null>(null)
	const mapRef = useRef<Map | null>(null);
	
	const vectorSource = useMemo(() => new VectorSource(), []);
	
	const [locations, setLocations] = useState<PointResponseData[]>([]);
	
	const backend = new BackendService();

	const createPointStyles = (location: PointResponseData): Style[] => {
		const textSize = 15; // Own 15, others 10
		const pointTextStyle = new Style({
			text: new Text({
				text: location.label || location.title,
				font: `bold ${textSize}px cursive,sans-serif`,
				fill: new Fill({
					color: location.textColor,
				}),
				stroke: new Stroke({
					color: 'white',
					width: 5,
				}),
				textBaseline: "bottom",
				textAlign: "right",
				offsetX: -15
			}),
		})
		const pointStyle = new Style({
			image: new Circle({
				radius:7,
				fill: new Fill({
					color: location.owner.color
				}),
				stroke: new Stroke({
					color: 'white',
					width: 2,
				})
			}),
		})
		return [pointStyle, pointTextStyle]
	}

	const renderPointsToMap = () => {
		//vectorSource.clear();
		locations.forEach((location) => {
			const { point } = location;
			const result = /SRID=(?<srid>\d+);POINT \((?<lon>[-.\d]+) (?<lat>[-.\d]+)\)/.exec(point)?.groups;
			const EPSG = result?.srid;
			const lon = result?.lon;
			const lat = result?.lat;
			if (lon && lat && EPSG) {
				// Required to transform coordinates to EPSG:3857, OpenStreetMap uses as the default CRS
				const transformedCoordinates =  transform([parseFloat(lon), parseFloat(lat)], `EPSG:${EPSG}`, 'EPSG:3857');
				const featurePoint = new Feature({
					geometry: new Point(transformedCoordinates),
					name: location.title,
					label: location.label,
					owner: location.owner,
					initial_point: location.point
				})
				const styles = createPointStyles(location);
				featurePoint.setStyle(styles)
				vectorSource.addFeature(featurePoint);
			}
			
		});
	}

	useEffect(() => {
		if (ref.current && !mapRef.current) {
			mapRef.current = new Map({
				layers: [
					new TileLayer({ source: new OSM() }),
					new VectorLayer({ source: vectorSource })
				],
				view: new View({ 
					center: [0, 0], 
					zoom: 1 
				}),
				target: ref.current
			});

			// interactions
			const select = new Select({
				condition: pointerMove
			});
			mapRef.current.addInteraction(select);
			
			overlayRef.current = new Overlay({
				element: refOverlay.current as  HTMLDivElement,
				positioning: "bottom-center",
				offset: [0, -10],
				autoPan: true,
			});
			
			mapRef.current.addOverlay(overlayRef.current);

			select.on("select", (e: SelectEvent) => {
				if (e.selected.length > 0) {
					const mapPoint = e.selected.find((feature) => feature.getGeometry() instanceof Point)
					if (mapPoint) {
						const pointProps = mapPoint.getProperties() as PointFeature;
						//console.log('Hovered over a point:', pointProps);
						const overlay = overlayRef.current?.getElement()
						overlay!.innerHTML = `
							<div>
								<i>Owner</i> - ${pointProps.owner.username} ${
								pointProps.owner.first_name ? "(" + 
								pointProps.owner.first_name + " " + 
								pointProps.owner.last_name + ")" : ""}
							</div> 
							<div><i>Label</i>: ${pointProps.label || "Not set"}</div>
							<div><i>Name</i>: ${pointProps.name}</div>
							<div><i>Point</i>: ${pointProps.initial_point}</div>
						`
						const mouseCoordinate = e.mapBrowserEvent.coordinate;
						overlayRef.current?.setPosition(mouseCoordinate);
						//console.log(mouseCoordinate, overlay)
					} else {
						overlayRef.current?.setPosition(undefined);
					}
				} else {
					overlayRef.current?.setPosition(undefined);
				}
			});
			
		}
	}, [ref, mapRef, vectorSource]);

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
		renderPointsToMap();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [locations])

	useEffect(() => {
		mapRef.current?.getView().setZoom(zoom); 
	}, [zoom]);

	return (
		<>
			<div ref={ref} id="map" />
			<div id="overlay" className="overlay" ref={refOverlay}/>
		</>					
	);
}

//*/

export default MapComponent;