import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useEffect, useRef, useState, useMemo, useContext, useCallback } from 'react';
import BackendService from '../../service/service';
import { NewPointDTO, Owner,  PointResponseData } from '../../service/backend-response.types';
import { PointFeature } from "./map-types";
import { AuthContext } from "../../context/AuthContext";
import OverlayContent from './overlay/overlay-content';
import ConfirmationModal from '../confirmation-modal/confirmation-modal';
// Openlayers
import VectorLayer from 'ol/layer/Vector';
import TileLayer from 'ol/layer/Tile';
import VectorSource from 'ol/source/Vector';
import Map from 'ol/Map';
import { View, Feature, MapBrowserEvent } from 'ol';
import OSM from "ol/source/OSM";
import { Point } from 'ol/geom';
import { get, transform } from 'ol/proj';
import { Style, Stroke, Text, Fill, Circle } from "ol/style";
import RegularShape from 'ol/style/RegularShape';
import { SelectEvent } from "ol/interaction/Select";
import { Modify, Snap, Select } from "ol/interaction";
import { pointerMove } from 'ol/events/condition';
import { Coordinate } from 'ol/coordinate';
import Overlay from 'ol/Overlay';
// styles
import "./map.styles.css";

import AddLocationIcon from '@mui/icons-material/AddLocation';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Tooltip, IconButton, AppBar, Toolbar } from '@mui/material';

function MapComponent({ zoom = 4 }: { zoom?: number }): JSX.Element {
	const ref = useRef<HTMLDivElement | null>(null);
	const refOverlay = useRef<HTMLDivElement | null>(null);
	const overlayRef = useRef<Overlay | null>(null);
	const mapRef = useRef<Map | null>(null);

	const { user } = useContext(AuthContext);
	
	const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
	const [isDrawing, setIsDrawing] = useState<boolean>(false);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [isDeleting, setIsDeleting] = useState<boolean>(false);
	const [overlayContent, setOverlayContent] = useState<null | JSX.Element>(null);
	const [locations, setLocations] = useState<PointResponseData[]>([]);
	const [newGeometry, setNewGeometry] = useState<null | Coordinate>(null)

	const vectorSource = useMemo(() => new VectorSource(), []);
	
	const backend = new BackendService();

	const ownPoint = (pointRadius: number, location: PointResponseData ): RegularShape => {
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
					id: location.id,
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

	const cancelHandler = () => {
		setIsDrawing(false);
		setIsEditing(false);
		setIsDeleting(false);
	}

	const handleSelect = useCallback((e: SelectEvent) => {
		const overlay = overlayRef.current?.getElement();
		if (overlay) {
			if (e.selected.length > 0) {
				const mapPoint = e.selected.find((feature) => feature.getGeometry() instanceof Point)
				if (mapPoint) {
					const pointProps = mapPoint.getProperties() as PointFeature;
					//console.log('Hovered over a point:', pointProps);
					setIsEditing((prevIsEditing) => {
						if (!prevIsEditing) {
							setOverlayContent(<OverlayContent pointProps={pointProps} />);
							const mouseCoordinate = e.mapBrowserEvent.coordinate;
							overlayRef.current?.setPosition(mouseCoordinate);
						} else {
							overlayRef.current?.setPosition(undefined);
							setOverlayContent(null);
						}
						return prevIsEditing;
					})		
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
	}, [overlayRef])

	const saveHandler = async (newPoint: NewPointDTO): Promise<void> => {
		setDialogIsOpen(false);
		try {
			const point = await backend.postPoint(newPoint);
			if (point) {
				const newPoint = {
					...point,
					owner: user as Owner
				} as PointResponseData
				setLocations((locations) => [...locations, newPoint])
				toast.success(`Point ${point.label || point.title} is published`)
			} else {
				const TemporaryPoint = {
					...newPoint,
					comment: "Anonymous User Temporary Point (Will not be saved)",
					owner: null,
					id: null,
					textColor: "red",
					point:`SRID=4326;POINT (${newPoint.point[0]} ${newPoint.point[1]})`
				} as unknown as PointResponseData
				setLocations((locations) => [...locations, TemporaryPoint])
			}
		} catch (err) {
			const axiosErr = (err as  AxiosError)
			if (axiosErr.message !== "canceled")
				toast.error(axiosErr.message, { autoClose: false });
			else
				console.error(axiosErr)
		}
	}
	// TODO
	const saveEditingDeletingHandler =async (data: any) => {
		console.log(newGeometry, "Geometry")
		if (isEditing) {
			console.log("edit", newGeometry);
		}
		if (isDeleting && newGeometry) {
			deletePoint(newGeometry)
		}
		await console.log("")
	}

	const deletePoint = async (newGeometry: Coordinate) => {
		const coordinate = transform(newGeometry, "EPSG:4326", "EPSG:3857");
		const tolerance = 220000; // Tolerance near the point
		// find the point from bounding box
		const bbox = [coordinate[0] - tolerance, coordinate[1] - tolerance, coordinate[0] + tolerance, coordinate[1] + tolerance];
		const selectedFeature = vectorSource.getFeaturesInExtent(bbox).find(
			(feature) => { 
				const point = feature?.getProperties() as PointFeature;
				const canDelete = point?.owner?.username === user?.username || user?.is_admin
				if (!canDelete) {
					toast.info(`Can't delete point ${point.label || point.name}, owned by ${point.owner? point.owner.username: "(User deleted)"}`);
				}
				return canDelete;
			}
		)
		const myPoint = selectedFeature?.getProperties() as PointFeature;
		if (myPoint && myPoint.id) {
			try {
				await backend.deletePoint(myPoint.id);
				toast.success(`Deleted Point ${myPoint.label || myPoint.name}, owned by ${myPoint.owner?.username}`);
				setLocations((locations) => locations.filter(loc => loc.id !== myPoint.id))
			} catch (err) {
				const axiosErr = (err as  AxiosError);
				if (axiosErr.message !== "canceled") {
					if ((axiosErr.response?.data as {detail: string}).detail) {
						toast.warning(`Point (${myPoint.label || myPoint.name}): ${(axiosErr.response?.data as {detail: string}).detail}`);
					} else {
						toast.error(axiosErr.message, { autoClose: false });
					}
				}
				else
					console.error(axiosErr)
			}
		} 
	}

	const handleMapClick = useCallback((e: MapBrowserEvent<PointerEvent>) => {
		const clickedCoord = mapRef.current?.getCoordinateFromPixel(e.pixel) as Coordinate;
		console.log(clickedCoord, "click")
		const transPoint = transform(clickedCoord, "EPSG:3857", "EPSG:4326");
		setNewGeometry(transPoint);
		setIsDrawing((prevIsDrawing) => {
			if (prevIsDrawing) {
				setDialogIsOpen((prevDialogIsOpen) => !prevDialogIsOpen);
			}
			return prevIsDrawing;
		})
	}, [])

	useEffect(() => {
		if (ref.current && !mapRef.current && overlayRef && refOverlay) {
			// Limit multi-world panning to one world east and west of the real world.
			// Geometry coordinates have to be within that range.
			const extent = get('EPSG:3857')?.getExtent().slice();
			mapRef.current = new Map({
				layers: [
					new TileLayer({ source: new OSM() }),
					new VectorLayer({ source: vectorSource })
				],
				view: new View({ 
					center: [1641912, 7943663], 
					zoom: 4,
					extent
				}),
				target: ref.current
			});

			// interactions 
			const select = new Select({
				condition: pointerMove,
				hitTolerance: 15
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

			select.on("select", handleSelect);

			mapRef.current.on("click", handleMapClick);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const select = mapRef.current?.getInteractions().getArray().find(
			interaction => interaction instanceof Select
		);
		if(isEditing || isDeleting) {
			const snapInteraction = new Snap({ source: vectorSource, pixelTolerance: 20 });
			const modify = new Modify({ source: vectorSource });
			mapRef.current?.addInteraction(snapInteraction);
			mapRef.current?.addInteraction(modify);
			if (select) {
				select.setActive(false);
			}
		} else {
			const snapInteraction = mapRef.current?.getInteractions().getArray().find(
				(interaction) => interaction instanceof Snap
			)
			if (snapInteraction)
				mapRef.current?.removeInteraction(snapInteraction);
			const modify = mapRef.current?.getInteractions().getArray().find(
				(interaction) => interaction instanceof Modify
			)
			if(modify)
				mapRef.current?.removeInteraction(modify);
			if (select)
				select.setActive(true);
		}
	}, [isEditing, vectorSource, isDeleting])


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
	}, [locations, user])

	useEffect(() => {
		mapRef.current?.getView().setZoom(zoom); 
	}, [zoom]);

	const applyCancelIcons = !isDrawing && !isEditing && !isDeleting;
	const applyIcon = isEditing || isDeleting;
	const canEditAndDelete = !!user;

	return (
		<div ref={ref} id="map" > 
			<AppBar position="absolute"  variant='elevation' color='transparent' style={{bottom: 0, top: "unset"}}>
				<Toolbar variant="dense" >
					{ applyCancelIcons &&
						<Tooltip title="Add Location">
							<IconButton  color="inherit" aria-label="add" sx={{ mr: 3 }} onClick={() => setIsDrawing(true)}>
								<AddLocationIcon />
							</IconButton>
						</Tooltip>  
					}
					{ applyIcon &&
						<Tooltip title="Apply">
							<IconButton  color="inherit" aria-label="confirm" sx={{ mr: 3 }} onClick={saveEditingDeletingHandler}>
								<CheckCircleIcon />
							</IconButton>
						</Tooltip>
					}
					{ !applyCancelIcons &&
						<Tooltip title="Cancel">
							<IconButton  color="inherit" aria-label="deny" sx={{ mr: 3 }} onClick={cancelHandler}>
								<CancelIcon />
							</IconButton>
						</Tooltip>
					}
					{ applyCancelIcons && canEditAndDelete &&
						<Tooltip title="Edit Location">
							<IconButton  color="inherit" aria-label="edit" sx={{ mr: 3 }} onClick={() => setIsEditing(true)}>
								<EditLocationIcon />
							</IconButton>
						</Tooltip>
					}
					{
					 applyCancelIcons && canEditAndDelete &&
						<Tooltip title="Delete Location">
							<IconButton  color="inherit" aria-label="delete" sx={{ mr: 3 }} onClick={() => setIsDeleting(true)}>
								<DeleteForeverIcon />
							</IconButton>
						</Tooltip>
					}
				</Toolbar>
			</AppBar>
			<div id="overlay" className="overlay" ref={refOverlay}>
				{overlayContent}
			</div>
			<ConfirmationModal 
				isOpen={dialogIsOpen} 
				onCancel={() => setDialogIsOpen(false)} 
				onConfirm={saveHandler}
				title={"Create point?"}
				point={newGeometry}
				/>
		</div>	
	);
}

//*/

export default MapComponent;