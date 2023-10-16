import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { basicToastContainerProps } from '../../utils/toastify';
import Nav from '../nav/nav';
			
const Navigation = () => {
	return (
		<div className="App" data-testid="App">
			<Nav />
			<Outlet />
			<ToastContainer {...basicToastContainerProps} />
		</div>
	);
}

export default Navigation;