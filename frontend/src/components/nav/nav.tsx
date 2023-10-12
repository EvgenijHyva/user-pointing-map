
import { AppBar, Toolbar, IconButton, Typography, Stack, Button } from "@mui/material";
import PublicIcon from '@mui/icons-material/Public';
import LogoutTwoToneIcon from '@mui/icons-material/LogoutTwoTone';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { AuthContext } from "../../context/AuthContext";
import { useContext } from 'react';

const Nav = (): JSX.Element => {
	const navigate = useNavigate();
	const { user, logout } = useContext(AuthContext);
	const logoutHandler = async () => {
		await logout();
		if (user)
			toast.info(`User "${user.username}" logged out`);
	}	
	return (
		<AppBar position='static'>
			<Toolbar>
				<IconButton 
					size='large' 
					edge="start" 
					area-label="logo"
					onClick={() => navigate("/")}
					style={{ color: "gold" }}
				>
					<PublicIcon  />
				</IconButton>
				<Typography variant='h6' component="div" sx={{ flexGrow:1 }}>
					User Pointing Map
				</Typography>
				<Stack direction="row" spacing={2}>
					{ user ? 
					<>
						<Typography variant='h6' 
							component="div" 
							sx={{ flexGrow:1 }} 
							style={{ alignSelf: "center", color: user?.is_admin ? "#d7ff62" : "white", alignItems: "center" }}>
							{ user?.is_admin && 
								<AdminPanelSettingsIcon />
							}
							{user.username}
							
						</Typography>
						<IconButton 
							size='large' 
							edge="end" 
							area-label="logout-button"
							onClick={logoutHandler}
							style={{ color: "#00ff0a" }}
						> 
							<LogoutTwoToneIcon  />
						</IconButton></> : <>
							<Button 
								color='inherit' 
								onClick={() => navigate("/auth")}
								>
									Login/Register
							</Button>
						</>
					}
				</Stack>
			</Toolbar>
		</AppBar>
	);
};

export default Nav;