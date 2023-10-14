import axios from 'axios';
import { PointResponseData, Owner, LoginDTO, TokenAuth, AppUser, RegisterDTO, NewPointDTO, UpdatePointDto, UpdatedPointsResponse } from './backend-response.types';
import Cookies from "js-cookie";


interface serviceConfig {
	responseEncoding: "utf8",
	responseType: "json",
	method: "get" | "post" | "put" | "delete",
	signal: AbortSignal,
	headers: {},
	withCredentials?: boolean,
}

class BackendService {
	private config: serviceConfig;
	private url = "http://localhost:8000";
	public controller = new AbortController();

	constructor(url?: string) {
		this.config = {
			responseEncoding: "utf8",
			method: "get",
			responseType: "json",
			signal: this.controller.signal,
			headers: {
				"Content-Type": "application/json",
			}
		};
		if (url)
			this.url = url;
	}
	
	getPoints = async (): Promise<PointResponseData[]>=> {
		const endpoint = `${this.url}/api/points/`;
		this.config.method = "get";

		try {
			const response = await axios.get<PointResponseData[]>(endpoint, this.config);
			return response.data;
		} catch (err) {
			console.log(err);
			throw err;
		}
	}

	postPoint = async (data: NewPointDTO): Promise<PointResponseData | undefined> => {
		const endpoint = `${this.url}/api/points/`;
		this.config.method = "post";
		this.config.withCredentials = true;
		const token = Cookies.get("access") ;
		this.config.headers = {
			...this.config.headers,
			'X-CSRFToken': Cookies.get("csrftoken")
		};
		if (!token) {
			return;
		}
		try {
			const response = await axios.post(endpoint, data, this.config);
			return response.data;
		} catch (err) {
			console.log(err);
			throw err;
		}
	}

	changePoints = async (data: UpdatePointDto[]): Promise<UpdatedPointsResponse | undefined> => {
		const endpoint = `${this.url}/api/points/`;
		this.config.method = "put";
		this.config.withCredentials = true;
		const token = Cookies.get("access") ;
		this.config.headers = {
			...this.config.headers,
			'X-CSRFToken': Cookies.get("csrftoken")
		};
		if (!token) {
			return;
		}
		try {
			const response = await axios.put(endpoint, data, this.config);
			return response.data;
		} catch (err) {
			console.log(err);
			throw err;
		}
	}

	deletePoint = async (id: number): Promise<void> => {
		const endpoint = `${this.url}/api/point/${id}`;
		this.config.method = "delete";
		this.config.withCredentials = true;
		this.config.headers = {
			...this.config.headers,
			'X-CSRFToken': Cookies.get("csrftoken")
		};
		const token = Cookies.get("access") ;
		if (!token) {
			return;
		}
		try {
			const response = await axios.delete(endpoint, this.config);
			return response.data;
		} catch (err) {
			console.log(err);
			throw err;
		}
	}

	getUser = async (): Promise<AppUser | undefined> => {
		const endpoint = `${this.url}/api/users/me/`;
		this.config.method = "get";
		this.config.withCredentials = true;
		const token = Cookies.get("access");

		if (!token) {
			return;
		}

		this.config.headers = {
			...this.config.headers,
		}

		try {
			const response = await axios.get<Owner>(endpoint, this.config);
			return response.data;
		} catch (err) {
			console.log(err);
			throw err;
		}
	}

	login = async (data: LoginDTO): Promise<TokenAuth> => {
		const endpoint = `${this.url}/api/users/login/`;
		this.config.method = "post";
		try {
			const response = await axios.post(endpoint, data, this.config);
			return response.data;
		} catch (err) {
			console.log(err);
			throw err;
		}
	}

	register = async (data: RegisterDTO): Promise<AppUser & TokenAuth> => {
		const endpoint = `${this.url}/api/users/register/`;
		this.config.method = "post";
		try {
			const response = await axios.post(endpoint, data, this.config);
			return response.data;
		} catch (err) {
			console.log(err);
			throw err;
		}
	
	}
}

export default BackendService;
