import { useState, createContext, ReactNode, useContext } from "react";
import { AppUser, LoginRegisterDTO } from '../service/backend-response.types';
import { AxiosError } from 'axios';
import BackendService from '../service/service';
import Cookies from "js-cookie";


interface initialContext {
  loading: boolean;
  user: null | AppUser;
  isAuthenticated: boolean;
  error: null | string;
  setLoading: (state: boolean) => void;
  setUser: (user: AppUser | null) => void;
  setIsAuthenticated: (state: boolean) => void;
  setError: (error: null | string) => void; 
  login: (data: LoginRegisterDTO) => void;
}

const initialContextState: initialContext = {
  loading: false,
  user: null,
  isAuthenticated: false,
  error: null,
  setUser: (user: AppUser | null) => {},
  setIsAuthenticated: (state: boolean) => {},
  setError: (error: null | string) => {},
  setLoading: (state: boolean) => {},
  login: () => {}
};

export const AuthContext = createContext(initialContextState);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<null | AppUser>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);
  const backendService = new BackendService();

  const login = async (data: LoginRegisterDTO) => {
    try {
      setLoading(true);
      setError(null);
      const response = await backendService.login(data)
      if (response) {
			Cookies.set("access", response.jwt, { 
				expires: 30, 
				secure: process.env.NODE_ENV !== "development",
				sameSite: "Lax",
				path: "/"
			});
			setIsAuthenticated(true)
		}
    } catch (err) {
      setLoading(false);
      let axiosErr = err as AxiosError
      console.log(err)
      setError(`${axiosErr.response?.statusText}. ${(axiosErr.response?.data as { detail: string}).detail}.`);
    }
  }

  return (
    <AuthContext.Provider value={{ loading, user, isAuthenticated, error, setError, setIsAuthenticated, setUser, setLoading, login }}>
      {children}
    </AuthContext.Provider>
  );
};
