import { createContext, useEffect, useState } from "react";
// Backend base URL loaded from Vite environment variables
const API_URL = import.meta.env.VITE_API_URL; 

/**
 * Create a React Context for authentication.
 * This will hold and share auth-related data
 * (user, loading state) across the app.
 */
export const AuthContext = createContext(null);

/**
 * AuthProvider is a React component that wraps
 * the app and provides auth data
 * to any component inside it.
 */
export function AuthProvider({ children }) {
  // Stores the authenticated user object (null if not logged in)
  const [user, setUser] = useState(null);
  // Async function that asks the backend if the user is already authenticated.
  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_URL}/auth`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.authenticated) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    }
  };

  /**
   * useEffect runs once when the AuthProvider is mounted.
   * We use it to ask the backend if the user is already authenticated.
   */
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * AuthContext.Provider makes the auth state
   * available to every component rendered inside it.
   */
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
