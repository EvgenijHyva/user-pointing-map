import { Grid, Paper, Avatar, TextField, Button } from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";

interface FormData {
  username: string;
  first_name: string;
  last_name: string;
  age: number;
  email: string;
  password: string;
}

const SignUpForm = (): JSX.Element => {
	const { register, handleSubmit } = useForm();

	const submit: SubmitHandler<FieldValues> = (data) => {
		
		console.log(data)
	}

	return (
		<Grid  container justifyContent="center" alignItems="center" > 
			<Paper elevation={10} className='paper-style'>
				<Grid container direction="column" alignItems="center">
					<Avatar> <PersonAddIcon /> </Avatar>
					<h2>Sign Up</h2>
				</Grid>
				<form onSubmit={handleSubmit(submit)}>
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
							placeholder='Enter lastname'
							fullWidth 
							{...register("first_name")}

						/>
						<TextField 
							type='text'
							label="Lastname" 
							placeholder='Enter name' 
							fullWidth
							{...register("last_name")}
						/>
						<TextField 
							label="age" 
							placeholder='Enter username'
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
						<Button type="submit" color="secondary" variant="contained" fullWidth > Sign Up </Button>
					</Grid>
				</form>
			</Paper>
		</Grid>
	);
};

export default SignUpForm;