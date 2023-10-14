import {  Dialog, DialogTitle, DialogContent, Grid, TextField, Button } from '@mui/material';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { NewPointDTO, PointBase } from '../../service/backend-response.types';
import { Coordinate } from 'ol/coordinate';

interface ModalProps {
	point: Coordinate | null;
	isOpen: boolean;
	onConfirm: (data: any) => void;
	onCancel: () => void;
	title: string;
}

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, title, point }: ModalProps): JSX.Element => {
	const { register, handleSubmit } = useForm();

	const submitHandler: SubmitHandler<FieldValues> = async (formData) => {
		const data: NewPointDTO = { 
			...formData as PointBase,
			created_at: new Date(),
			updated_at: new Date(),
			point: point?.length === 2 ? point : []
		}
		onConfirm(data);
	}
	return (
		<Dialog open={isOpen} maxWidth="md">
			<DialogTitle>{ title }</DialogTitle>
			<DialogContent>
				<form onSubmit={handleSubmit(submitHandler)}>
					<Grid container gap="25px" margin={"20px 0"}>
						<TextField 
							label="Title" 
							placeholder='Point title' 
							fullWidth
							required
							type='text'
							{...register("title")}
						/>
						<TextField 
							label="Label"
							placeholder='Enter Label' 
							fullWidth 
							type='text'
							{...register("label")}
						/>
						<TextField 
							label="Comment"
							placeholder='Any comment?' 
							fullWidth 
							type='text'
							{...register("comment")}
						/>
						<Button 
							type="submit" 
							color="success" 
							variant="contained" 
						> 
						Confirm 
						</Button>
						<Button 
							type="reset" 
							color="error" 
							variant="contained" 
							onClick={onCancel}
						> 
						Cancel 
						</Button>
					</Grid>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default ConfirmationModal;