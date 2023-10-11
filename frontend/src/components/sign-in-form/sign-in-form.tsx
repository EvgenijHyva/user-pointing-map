import { Grid, Paper, Avatar, TextField, Button } from "@mui/material";
import PeopleTwoToneIcon from '@mui/icons-material/PeopleTwoTone';
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { toast } from 'react-toastify';
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { LoginRegisterDTO } from '../../service/backend-response.types';

const SignInForm = (): JSX.Element => {
	const { register, handleSubmit } = useForm();
	const navigate = useNavigate();
	const { loading, error, isAuthenticated, login } = useContext(AuthContext)

	const submitHandler: SubmitHandler<FieldValues> = async (data) => {
		await login(data as LoginRegisterDTO);
	}

	useEffect(()=> {
		if (isAuthenticated) {
			navigate("/");
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated])

	useEffect(() => {
		if (error) {
			toast(error)
		}
	}, [error])

	return (
		<Grid  container justifyContent="center" alignItems="center"> 
			<Paper elevation={10} className='paper-style'>
				<Grid container direction="column" alignItems="center">
					<Avatar style={{ background: "green"}}><PeopleTwoToneIcon  /></Avatar>
					<h2>Sign In</h2>
				</Grid>
				<form onSubmit={handleSubmit(submitHandler)}>
					<Grid container gap="25px">
						<TextField 
							label="Username" 
							placeholder='Enter username' 
							fullWidth 
							required
							type='text'
							{...register("username")}
						/>
						<TextField 
							label="password"
							placeholder='Enter password' 
							fullWidth 
							required 
							type='password'
							{...register("password")}
						/>
						<Button 
							type="submit" 
							color="primary" 
							variant="contained" 
							fullWidth 
							disabled={loading}
						> { loading ? "Just a second" : "Sign In" } </Button>
					</Grid>
				</form>
			</Paper>
		</Grid>
	);
};

export default SignInForm;