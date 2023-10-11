import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { basicToastContainerProps } from '../../utils/toastify';

const Navigation = () => {
	return (
		<div className="App">
			<Outlet />
			<ToastContainer {...basicToastContainerProps} />
		</div>
	);
}

export default Navigation;