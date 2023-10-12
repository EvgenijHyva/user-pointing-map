import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useEffect, useRef, useState, useMemo } from 'react';
import BackendService from '../../service/service';
import { PointResponseData } from '../../service/backend-response.types';
import { PointFeature } from "./map-types";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from 'react';
import OverlayContent from './overlay/overlay-content';
// Openlayers
import VectorLayer from 'ol/layer/Vector';
import TileLayer from 'ol/layer/Tile';
import VectorSource from 'ol/source/Vector';
import Map from 'ol/Map';
import { View, Feature } from 'ol';
import OSM from "ol/source/OSM";
import { Point } from 'ol/geom';
import { transform } from 'ol/proj';
import { Style, Stroke, Text, Fill, Circle } from "ol/style";
import RegularShape from 'ol/style/RegularShape';
import { SelectEvent } from "ol/interaction/Select";
import { Draw, Modify, Snap, Select } from "ol/interaction";
import { pointerMove } from 'ol/events/condition';
import Overlay from 'ol/Overlay';
// styles
import "./map.styles.css";

import AddLocationIcon from '@mui/icons-material/AddLocation';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Tooltip, IconButton, AppBar, Toolbar } from '@mui/material';

function MapComponent({ zoom = 4 }: { zoom?: number }): JSX.Element {
	const ref = useRef<HTMLDivElement | null>(null);
	const refOverlay = useRef<HTMLDivElement | null>(null);
	const overlayRef = useRef<Overlay | null>(null);
	const mapRef = useRef<Map | null>(null);

	const { user } = useContext(AuthContext);
	
	const vectorSource = useMemo(() => new VectorSource(), []);

	const [isDrawing, setIsDrawing] = useState<boolean>(false);
	const [draw, setDraw] = useState<Draw | null>(null);
	const [snap, setSnap] = useState<Snap | null>(null);
	const [overlayContent, setOverlayContent] = useState<null | JSX.Element>(null);
	const [locations, setLocations] = useState<PointResponseData[]>([]);
	
	const backend = new BackendService();

	const ownPoint = (pointRadius: number, location: PointResponseData ) => {
		return new RegularShape({ // Own points 
			points: 5,
			radius1: pointRadius,
			radius2: pointRadius / 1.8,
			angle: 0, 
			fill: new Fill({
				color: location.owner?.color ?? location.textColor
			}),
			stroke: new Stroke({
				color: 'white',
				width: 2
			})
		});
	}

	const createPointStyles = (location: PointResponseData): Style[] => {
		const own = user && user?.username === location.owner?.username;
		const textSize = own ? 16 : 10; // Own 15, others 10
		const pointRadius = own ? 10 : 5
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
			image: !own ? new Circle({ // Some other users points
				radius: pointRadius,
				fill: new Fill({
					color: location.owner?.color ?? location.textColor
				}),
				stroke: new Stroke({
					color: 'white',
					width: 2,
				})
			}) : ownPoint(pointRadius, location)
		})
		return [pointStyle, pointTextStyle]
	}

	const renderPointsToMap = () => {
		if(!mapRef || !ref) return;
		vectorSource.clear();
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
					comment: location.comment,
					initial_point: location.point,
					created_at: location.created_at,
					updated_at: location.updated_at
				})
				const styles = createPointStyles(location);
				featurePoint.setStyle(styles)
				vectorSource.addFeature(featurePoint);
			}
			
		});
	}

	useEffect(() => {
		if (ref.current && !mapRef.current && overlayRef && refOverlay) {
			mapRef.current = new Map({
				layers: [
					new TileLayer({ source: new OSM() }),
					new VectorLayer({ source: vectorSource })
				],
				view: new View({ 
					center: [1641912, 7943663], 
					zoom: 4 
				}),
				target: ref.current
			});

			// interactions
			const select = new Select({
				condition: pointerMove
			});
			mapRef.current.addInteraction(select);

			// overlay
			overlayRef.current = new Overlay({
				element: refOverlay.current as  HTMLDivElement,
				positioning: "bottom-center",
				offset: [0, -10],
				autoPan: true,
			});
			
			mapRef.current.addOverlay(overlayRef.current);

			select.on("select", (e: SelectEvent) => {

				const overlay = overlayRef.current?.getElement();

				if (overlay) {
					if (e.selected.length > 0) {
						const mapPoint = e.selected.find((feature) => feature.getGeometry() instanceof Point)
						if (mapPoint) {
							const pointProps = mapPoint.getProperties() as PointFeature;
							//console.log('Hovered over a point:', pointProps);
							
							setOverlayContent(<OverlayContent pointProps={pointProps} />);
							
							const mouseCoordinate = e.mapBrowserEvent.coordinate;
							overlayRef.current?.setPosition(mouseCoordinate);
							//console.log(mouseCoordinate)
						} else {
							overlayRef.current?.setPosition(undefined);
							setOverlayContent(null);
						}
					} else {
						overlayRef.current?.setPosition(undefined);
						setOverlayContent(null);
					}
				}
			});
		}
	}, [ref, mapRef, vectorSource]);

	useEffect(() => {
		async function fetchData() {
			try {
				const result = await backend.getPoints();
				setLocations(result);
			} catch (err) {
				const axiosErr = (err as  AxiosError)
				if (axiosErr.message !== "canceled")
					toast(axiosErr.message);
				else
					console.error(axiosErr)
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
		<div ref={ref} id="map" > 
			<AppBar position="absolute"  variant='elevation' color='primary' style={{bottom: 0, top: "unset"}}>
				<Toolbar variant="dense" >
					<Tooltip title="Add Location">
						<IconButton  color="inherit" aria-label="add" sx={{ mr: 3 }}>
							<AddLocationIcon />
						</IconButton>
					</Tooltip>
					<Tooltip title="Edit Location">
						<IconButton  color="inherit" aria-label="edit" sx={{ mr: 3 }}>
							<EditLocationIcon />
						</IconButton>
					</Tooltip>
					<Tooltip title="Apply">
						<IconButton  color="inherit" aria-label="confirm" sx={{ mr: 3 }}>
							<CheckCircleIcon />
						</IconButton>
					</Tooltip>
					<Tooltip title="Cancel">
						<IconButton  color="inherit" aria-label="deny" sx={{ mr: 3 }}>
							<CancelIcon />
						</IconButton>
					</Tooltip>
				</Toolbar>
			</AppBar>
			<div id="overlay" className="overlay" ref={refOverlay}>
				{overlayContent}
			</div>
		</div>	
	);
}

//*/

export default MapComponent;