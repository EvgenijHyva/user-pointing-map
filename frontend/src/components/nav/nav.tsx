
import { AppBar, Toolbar, IconButton, Typography, Stack, Button, Tooltip } from "@mui/material";
import PublicIcon from '@mui/icons-material/Public';
import LogoutTwoToneIcon from '@mui/icons-material/LogoutTwoTone';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
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
				<Tooltip title="Main page" enterDelay={500} leaveDelay={200}>
					<IconButton 
						size='large' 
						edge="start" 
						area-label="logo"
						onClick={() => navigate("/")}
						style={{ color: "gold" }}
					>
						<PublicIcon  />
					</IconButton>
				</Tooltip>
				<Typography variant='h6' component="div" sx={{ flexGrow:1 }}>
					User Pointing Map
				</Typography>
				<Stack direction="row" spacing={2}>
					{ user ? 
					<>
						<Tooltip title={`Logget as ${user?.is_admin ? "admin" : "normal user"}`}>
							<Typography variant='h6' 
								component="div" 
								sx={{ flexGrow:1 }} 
								style={{ alignSelf: "center", color: user?.is_admin ? "#d7ff62" : "white", alignItems: "center" }}>
								{ user?.is_admin ? 
									<AdminPanelSettingsIcon /> : <PersonOutlineIcon />
								}
								{user.username}
								
							</Typography>
						</Tooltip>
						<Tooltip title="Logout" enterDelay={100} enterNextDelay={500} leaveDelay={200}>
							<IconButton 
								size='large' 
								edge="end" 
								area-label="logout-button"
								onClick={logoutHandler}
								style={{ color: "#00ff0a" }}
							> 
								<LogoutTwoToneIcon  />
							</IconButton>
						</Tooltip>
						</> : <>
							<Tooltip title="Auth page" leaveDelay={200}>
								<Button 
									color='inherit' 
									onClick={() => navigate("/auth")}
									>
										Login/Register
								</Button>
							</Tooltip>
						</>
					}
				</Stack>
			</Toolbar>
		</AppBar>
	);
};

export default Nav;