import axios, { AxiosResponse } from 'axios';
import { PointData, PointResponseData, Owner, LoginDTO, TokenAuth, AppUser, RegisterDTO } from './backend-response.types';
import Cookies from "js-cookie";


interface serviceConfig {
	responseEncoding: "utf8",
	responseType: "json",
	method?: "get" | "post" | "put" | "delete",
	signal: AbortSignal,
	headers: {},
	withCredentials?: boolean
}

class BackendService {
	private config: serviceConfig;
	private url = "http://localhost:8000";
	public controller = new AbortController();

	constructor(url?: string) {
		this.config = {
			responseEncoding: "utf8",
			responseType: "json",
			signal: this.controller.signal,
			headers: {
				"Content-Type": "application/json"
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

	postPoint = async (data: PointData): Promise<AxiosResponse<PointResponseData>> => {
		const endpoint = `${this.url}/api/points/`;
		this.config.method = "post";
		try {
			const response = await axios.post(endpoint, data, this.config);
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
			//Cookie: `jwt=${token}`
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
