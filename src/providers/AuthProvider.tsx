import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from "react";

export interface User {
  rollNumber: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode; 
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem("dynamic-form-user");
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        if (parsedUser && parsedUser.rollNumber && parsedUser.name) {
          setUser(parsedUser);
        } else {
          console.warn("Stored user data is invalid.");
          sessionStorage.removeItem("dynamic-form-user");
        }
      }
    } catch (error) {
      console.error("Failed to parse stored user session:", error);
      sessionStorage.removeItem("dynamic-form-user"); 
    } finally {
      setIsLoading(false); 
    }
  }, []);

  const login = useCallback((userData: User) => {
    setUser(userData);
    sessionStorage.setItem("dynamic-form-user", JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem("dynamic-form-user");
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
