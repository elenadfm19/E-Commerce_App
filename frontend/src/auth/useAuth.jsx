// Import React's useContext hook
import { useContext } from "react";

// Import the AuthContext created in AuthContext.jsx
import { AuthContext } from "./AuthContext.jsx";

/**
 * Custom hook that provides access to authentication state and actions
 * from anywhere in the component tree.
 */
export function useAuth() {
  // Read the current value of AuthContext
  const context = useContext(AuthContext);

  /*
    Safety check:
    If this hook is used outside of <AuthProvider>,
    AuthContext will be undefined (or null).
  */
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  // Return the context value so components can use it
  return context;
}

