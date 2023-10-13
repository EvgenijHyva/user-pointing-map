import {  Dialog, DialogTitle, DialogContent, Grid, TextField, Button } from '@mui/material';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { NewPointDTO, PointBase } from '../../service/backend-response.types';

interface ModalProps {
	isOpen: boolean;
	onConfirm: (data: any) => void;
	onCancel: () => void;
	title: string;
}

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, title }: ModalProps): JSX.Element => {
	const { register, handleSubmit } = useForm();

	const submitHandler: SubmitHandler<FieldValues> = async (formData) => {
		const data: NewPointDTO = { 
			...formData as PointBase,
			created_at: new Date(),
			updated_at: new Date(),
			point: ""
		}
		console.log(data, "data")
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
							type="submit" 
							color="error" 
							variant="contained" 
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