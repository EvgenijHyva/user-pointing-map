import { PointFeature } from '../map-types';
import { AuthContext } from "../../../context/AuthContext";
import { useContext } from 'react';


interface Point {
	pointProps: PointFeature;
};

const OverlayContent = ({ pointProps }: Point): JSX.Element => {
	const { user } = useContext(AuthContext);
	const canSee = user?.is_admin || (pointProps.owner?.username === user?.username && !undefined);
	return (
		<div>
			<div>
				<i>Owner</i> - <b>
					{pointProps.owner?.username ?? 'deleted'}{' '}
					{pointProps.owner?.first_name && canSee
					? `(${pointProps.owner.first_name} ${pointProps.owner.last_name})`
					: ''}
				</b>
			</div>
			<hr />
			<div>
				<i>Label</i>: {pointProps.label || 'Not set'}
			</div>
			<div>
				<i>Name</i>: {pointProps.name}
			</div>
			{ canSee &&
				<div>
					<i>Point</i>: {pointProps.initial_point}
				</div>
			}
			{pointProps.comment && canSee && (
				<div>
				<i>Comment</i>: {pointProps.comment}
				</div>
			)}
			<div>
				<i>Created</i>: {new Date(pointProps.created_at).toString()}
			</div>
			{ canSee &&
				<div>
					<i>Updated</i>: {new Date(pointProps.updated_at).toString()}
				</div>
			}
		</div>
	);
}

export default OverlayContent;