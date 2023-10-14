import { Button, Dialog, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { NewPointDTO } from '../../service/backend-response.types';
import { useEffect } from 'react';


interface ModalProps {
	editedPoint: NewPointDTO | null;
	isOpen: boolean;
	onConfirm: (data: NewPointDTO) => void;
	onCancel: () => void;
}

const EditDialog = ({ isOpen, onConfirm, onCancel, editedPoint }: ModalProps): JSX.Element => {
	const { register, handleSubmit, setValue } = useForm();

	const submitHandler: SubmitHandler<FieldValues> = async (formData) => {
		const data: NewPointDTO = { 
			...editedPoint as NewPointDTO,
			...formData as { title: string, label:string, comment: string}
		}
		onConfirm(data);
	}

	useEffect(() => {
		if (editedPoint) {
		setValue("title", editedPoint.title || "");
		setValue("label", editedPoint.label || "");
		setValue("comment", editedPoint.comment || "");
		}
	}, [editedPoint, setValue]);
	
	return (
		<Dialog open={isOpen} maxWidth="md">
			<DialogTitle>Editing point</DialogTitle>
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

export default EditDialog;