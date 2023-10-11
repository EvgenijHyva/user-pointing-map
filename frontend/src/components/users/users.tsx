
import { useEffect, useState} from 'react';
import BackendService from '../../service/service';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { Owner } from '../../service/backend-response.types';

const Users = (): JSX.Element => {
	const [user, setUser] = useState<Owner | null>(null);

	useEffect(() => {
	let isMounted = true;
	const backendService = new BackendService();

	const getUser = async () => {
		try {
			const response = await backendService.getUser();
			isMounted && setUser(response);
		} catch (err) {
			const axiosErr = (err as  AxiosError)
			if (axiosErr.message !== "canceled")
				toast(axiosErr.message);
			else
				console.error(axiosErr)
		}
	}
	getUser();
	
	return () => {
		isMounted = false;
		backendService.controller.abort()
	}
	}, [])

	return (
		<div>users</div>
	)
}

export default Users;