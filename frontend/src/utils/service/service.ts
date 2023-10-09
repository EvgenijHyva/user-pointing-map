import axios, { AxiosResponse, AxiosError } from 'axios';
import { PointData, PointResponseData } from './backend-response.types';

interface serviceConfig {
	responseEncoding: "utf8",
	responseType: "json",
	method?: "get" | "post" | "put" | "delete" 
}

class BackendService {
	private config: serviceConfig;
	private url = "http://localhost:8000";
	constructor(url?: string) {
		this.config = {
			responseEncoding: "utf8",
			responseType: "json"
		}
		if (url)
			this.url = url;
	}
	
	getPoints = async (): Promise<PointResponseData[]>=> {
		const endpoint = `${this.url}/api/points/`;
		this.config.method = "get";
		try {
			const response = await axios.get<PointResponseData[]>(endpoint, this.config);
			return response.data 
		} catch (err) {
			console.log(err)
			throw err;
		}
	}

	postPoint = async (data: PointData): Promise<AxiosResponse<PointResponseData>> => {
		const endpoint = `${this.url}/api/points/`;
		this.config.method = "post";
		try {
			const response = await axios.post(endpoint, data, this.config);
			return response.data
		} catch (err) {
			console.log(err)
			throw err;
		}
	}
}

export default BackendService;
