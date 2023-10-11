import SignInForm from '../sign-in-form/sign-in-form';
import SignUpForm from '../sign-up-form/sigm-up-form';

import "./auth.styles.css";
const AuthComponent = (): JSX.Element => {
	return (
		<div className='auth-container'>
			<SignInForm />
			<SignUpForm />
		</div>
	);
};

export default AuthComponent;