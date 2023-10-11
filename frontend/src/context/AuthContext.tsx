import { useState, createContext, ReactNode, useEffect } from "react";
import { AppUser, LoginDTO, RegisterDTO } from '../service/backend-response.types';
import { AxiosError } from 'axios';
import BackendService from '../service/service';
import Cookies from "js-cookie";
import { toast } from 'react-toastify';


interface initialContext {
  loading: boolean;
  user: null | AppUser;
  isAuthenticated: boolean;
  error: null | string;
  login: (data: LoginDTO) => void;
  getUser: () => void;
  registerUser: (data: RegisterDTO) => void;
}

const initialContextState: initialContext = {
  loading: false,
  user: null,
  isAuthenticated: false,
  error: null,
  login: () => {},
  getUser: () => {},
  registerUser: () => {}
};

export const AuthContext = createContext(initialContextState);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<null | AppUser>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);
  const backendService = new BackendService();

  const login = async (data: LoginDTO) => {
    setLoading(true);
    setError(null);
    try {
      const response = await backendService.login(data)
      if (response) {
			Cookies.set("access", response.jwt, { 
				expires: 30, 
				secure: process.env.NODE_ENV !== "development", // Dev
				sameSite: "Lax",
				path: "/"
			});
      setIsAuthenticated(true)
		}
    } catch (err) {
      setLoading(false);
      const axiosErr = err as AxiosError;
      console.error(err);
      setError(`${axiosErr.response?.statusText}. ${(axiosErr.response?.data as { detail: string}).detail}.`);
    }
  }

  const getUser = async (): Promise<void> => {
    const token = Cookies.get("access");
    if (!token) {
      return;
    }
    const appUser = await backendService.getUser();
    if(appUser) {
      setUser(appUser);
    } 
  }

  const registerUser =async (data: RegisterDTO): Promise<void> => {
    setError(null);
    setLoading(true);
    try {
      const response = await backendService.register(data);
      if (response) {
        setIsAuthenticated(true)
      }
    } catch (err) {
      setLoading(false);
      const axiosErr = err as AxiosError;
      console.error(err)
      setError(`${axiosErr.response?.statusText}. ${(axiosErr.response?.data as { detail: string}).detail}.`);
    }
  }

  useEffect(() => {
		if (error) {
			toast(error)
		}
	}, [error])

  return (
    <AuthContext.Provider value={{ 
        loading, 
        user, 
        isAuthenticated, 
        error, 
        login, 
        getUser,
        registerUser
      }}>
      {children}
    </AuthContext.Provider>
  );
};
