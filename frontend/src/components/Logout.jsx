import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "../auth/useAuth";
import { resetCart } from "../features/cart/cartSlice.jsx";
// Backend base URL loaded from Vite environment variables
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Logout component
 * Automatically logs out the current user when mounted.
 */
export default function Logout() {
  // Access user state and setter from AuthContext
  const { user, setUser } = useAuth();
  // Stores error messages to show to the user
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /**
   * Logs out the current user by:
   * 1. Calling the backend logout endpoint
   * 2. Clearing the user from AuthContext
   * 3. Resetting the cart in Redux
   */
  async function logout() {
    try {
      const res = await fetch(`${API_URL}/users/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Required to clear the session cookie
      });
      const data = await res.json();
      // If logout was successful
      if (res.status == 200) {
        setUser(null); // Clear authenticated user
        dispatch(resetCart()); // Reset cart state in Redux
      }
      //setUser(null);
    } catch (error) {
      setError("An error has happened. Please try to logout again.");
    }
  }

  /**
   * Runs once when the component mounts.
   * Automatically logs out the user.
   */
  useEffect(() => {
    logout();
  }, []);

  // Show error message if something went wrong
  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div id='logout'>
      <p>See you soon!</p>
      {/* Button to navigate back to the menu */}
      <button
        onClick={() => {
          navigate("/", { replace: true }) ;
        }} className='green-button'
      >
        Home
      </button>
    </div>
  );
}
