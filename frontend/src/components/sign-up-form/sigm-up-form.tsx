import { Grid, Paper, Avatar, TextField, Button } from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { RegisterDTO } from '../../service/backend-response.types';


const SignUpForm = (): JSX.Element => {
	const { register, handleSubmit } = useForm();
	const { loading, registerUser } = useContext(AuthContext);

	const submit: SubmitHandler<FieldValues> = async (data) => {
		const registerData = data as RegisterDTO;
		if (!registerData.age)
			registerData.age = null;
		await registerUser(registerData);
	}

	return (
		<Grid  container justifyContent="center" alignItems="center" > 
			<Paper elevation={10} className='paper-style' style={{ maxHeight: "100vh"}}>
				<Grid container direction="column" alignItems="center">
					<Avatar> <PersonAddIcon /> </Avatar>
					<h2>Sign Up</h2>
				</Grid>
				<form onSubmit={handleSubmit(submit)} data-testid="sign-up-form">
					<Grid container gap="25px">
						<TextField 
							label="Username" 
							placeholder='Enter username' 
							fullWidth
							type='text'
							required 
							{...register("username")}
						/>
						<TextField  
							label="Firstname" 
							type='text'
							placeholder='Enter firstname'
							fullWidth 
							{...register("first_name")}

						/>
						<TextField 
							type='text'
							label="Lastname" 
							placeholder='Enter lastname' 
							fullWidth
							{...register("last_name")}
						/>
						<TextField 
							label="age"
							placeholder='Enter age'
							fullWidth type='number'
							{...register("age")}
						/>
						<TextField 
							label="email" 
							type='email'
							placeholder='Enter email'
							fullWidth
							{...register("email")}
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
							color="secondary" 
							variant="contained" 
							fullWidth
							disabled={loading}
						> { loading ? "Registering new user" : "Sign Up" } </Button>
					</Grid>
				</form>
			</Paper>
		</Grid>
	);
};

export default SignUpForm;