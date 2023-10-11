import { useState, createContext, ReactNode, useContext } from "react";
import { AppUser } from '../service/backend-response.types';

interface initialContext {
  loading: boolean;
  user: null | AppUser;
  isAuthenticated: boolean;
  error: null | string;
  setLoading: (state: boolean) => void;
  setUser: (user: AppUser | null) => void;
  setIsAuthenticated: (state: boolean) => void;
  setError: (error: null | string) => void; 
}

const initialContextState: initialContext = {
  loading: false,
  user: null,
  isAuthenticated: false,
  error: null,
  setUser: (user: AppUser | null) => {},
  setIsAuthenticated: (state: boolean) => {},
  setError: (error: null | string) => {},
  setLoading: (state: boolean) => {}
};

const AuthContext = createContext(initialContextState);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<null | AppUser>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);

  return (
    <AuthContext.Provider value={{ loading, user, isAuthenticated, error, setError, setIsAuthenticated, setUser, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
