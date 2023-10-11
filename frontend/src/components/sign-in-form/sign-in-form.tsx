import { Grid, Paper, Avatar, TextField, Button } from "@mui/material";
import PeopleTwoToneIcon from '@mui/icons-material/PeopleTwoTone';
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";


const SignInForm = (): JSX.Element => {
	const { register, handleSubmit } = useForm();

	const submit: SubmitHandler<FieldValues> = (data) => {
		console.log(data)
	}

	return (
		<Grid  container justifyContent="center" alignItems="center"> 
			<Paper elevation={10} className='paper-style'>
				<Grid container direction="column" alignItems="center">
					<Avatar style={{ background: "green"}}><PeopleTwoToneIcon  /></Avatar>
					<h2>Sign In</h2>
				</Grid>
				<form onSubmit={handleSubmit(submit)}>
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
						<Button type="submit" color="primary" variant="contained" fullWidth> Sign In </Button>
					</Grid>
				</form>
			</Paper>
		</Grid>
	);
};

export default SignInForm;