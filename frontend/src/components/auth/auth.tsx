import { useContext, useEffect } from 'react';
import SignInForm from '../sign-in-form/sign-in-form';
import SignUpForm from '../sign-up-form/sigm-up-form';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from "react-router-dom";

import "./auth.styles.css";

const AuthComponent = (): JSX.Element => {
	const {  isAuthenticated } = useContext(AuthContext);
	const navigate = useNavigate();

	useEffect(()=> {
		if (isAuthenticated) {
			navigate("/");
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated])


	return (
		<div className='auth-container' data-testid="auth-container">
			<SignInForm />
			<SignUpForm />
		</div>
	);
};

export default AuthComponent;