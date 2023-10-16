import { Grid, Paper, Avatar, TextField, Button } from "@mui/material";
import PeopleTwoToneIcon from '@mui/icons-material/PeopleTwoTone';
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from 'react';
import { LoginDTO } from '../../service/backend-response.types';

const SignInForm = (): JSX.Element => {
	const { register, handleSubmit } = useForm();
	const { loading, login } = useContext(AuthContext);

	const submitHandler: SubmitHandler<FieldValues> = async (data) => {
		await login(data as LoginDTO);
	}

	return (
		<Grid  container justifyContent="center" alignItems="center" > 
			<Paper elevation={10} className='paper-style' >
				<Grid container direction="column" alignItems="center">
					<Avatar style={{ background: "green"}}><PeopleTwoToneIcon  /></Avatar>
					<h2>Sign In</h2>
				</Grid>
				<form onSubmit={handleSubmit(submitHandler)} data-testid="sign-in-form">
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