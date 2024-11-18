import {
  useState,
  useContext,
  createContext,
  useMemo,
  useEffect,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";

type AuthContextType = {
  token: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    type: string;
    iat: number;
    exp: number;
  } | null;
  setToken: (newToken: string | null) => void;
  getAuthHeaders: () => { authorization: string } | {};
};

type AuthProviderProps = {
  children: ReactNode; // Explicitly typing children
};

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The AuthProvider component that will wrap components where authentication is needed
const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken_] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  // Function to update the token in state and local storage
  const setToken = (newToken: string | null) => {
    setToken_(newToken);
  };

  // Function to get the auth headers for requests
  const getAuthHeaders = () => {
    return token ? { authorization: `bearer ${token}` } : {};
  };

  // Whenever the token changes, store or remove it from local storage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      setUser(jwtDecode(token));
    } else {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, [token]);

  // Memoize the context value to avoid unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      token,
      setToken,
      getAuthHeaders,
      user,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token, user]
  );

  // Provide the context to child components
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Hook to allow easy access to the AuthContext
export const useAuth = (): AuthContextType => {
  return useContext(AuthContext)!; // `!` tells TypeScript you're confident this won't be null/undefined.
};

export default AuthProvider;
