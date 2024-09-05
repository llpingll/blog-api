import { useState, useContext, createContext, useMemo, useEffect } from "react";

// Create the AuthContext
const AuthContext = createContext();

// The AuthProvider component that will wrap components where authentication is needed
// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
  const [token, setToken_] = useState(localStorage.getItem("token"));

  // Function to update the token in state and local storage
  const setToken = (newToken) => {
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
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // Memoize the context value to avoid unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      token,
      setToken,
      getAuthHeaders,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token]
  );

  // Provide the context to child components
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Hook to allow easy access to the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
