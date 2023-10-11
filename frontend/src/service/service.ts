import axios, { AxiosResponse } from 'axios';
import { PointData, PointResponseData, Owner, LoginRegisterDTO, TokenAuth } from './backend-response.types';

interface serviceConfig {
	responseEncoding: "utf8",
	responseType: "json",
	method?: "get" | "post" | "put" | "delete",
	signal: AbortSignal
}

class BackendService {
	private config: serviceConfig;
	private url = "http://localhost:8000";
	public controller = new AbortController();

	constructor(url?: string) {
		this.config = {
			responseEncoding: "utf8",
			responseType: "json",
			signal: this.controller.signal
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

	getUser = async (): Promise<Owner> => {
		const endpoint = `${this.url}/api/users/me/`;
		this.config.method = "get";
		try {
			const response = await axios.get<Owner>(endpoint, this.config);
			return response.data;
		} catch (err) {
			console.log(err);
			throw err;
		}
	}
	// TODO promises
	login = async (data: LoginRegisterDTO): Promise<any> => {
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
	register = async (data: LoginRegisterDTO): Promise<any> => {
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
	token = async (data: LoginRegisterDTO): Promise<TokenAuth> => {
		const endpoint = `${this.url}/api/users/token/`;
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
