import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
// Backend base URL loaded from Vite environment variables
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Profile component
 * Displays the authenticated user's profile information
 * and allows the user to delete their account.
 */
export default function Profile() {
  // Access authenticated user and setter from AuthContext
  const { user, setUser } = useAuth();
  // Stores error messages to show to the user
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  console.log(user);
  /**
   * Deletes the user's profile by:
   * 1. Calling the backend delete user endpoint
   * 2. Clearing the user from AuthContext
   */
  async function deleteProfile(e) {
    e.preventDefault();
    try {
      // Call backend endpoint to delete the user profile
      const res = await fetch(`${API_URL}/users/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Required to identify the logged-in user
      });
      const data = await res.json();
      // If deletion was successful, clear user from context
      if (res.status == 200) {
        setUser(null);
      }
    } catch (error) {
      setError(
        "An error has happened. Please try to delete your profile again."
      );
    }
  }

  // Show error message if something went wrong
  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      {/* If the user exists, show profile information */}
      {user ? (
        <div id='profile'>
          <p>First name: {user.firstname}</p>
          <p>Last name: {user.lastname}</p>
          <p>E-mail: {user.email}</p>
          <p>Address: {user.address}</p>
          {/* Button to delete the user's profile */}
          <button onClick={deleteProfile} className="green-button">
            Delete profile
          </button>
          {/* Navigate back to the menu */}
          <button
            onClick={() => {
              navigate("/", { replace: true });
            }} className="green-button"
          >
            Menu
          </button>
        </div>
      ) : (
        // If user is null (profile deleted), show confirmation
        <div id='profile-deleted'>
          <p>The profile has been deleted.</p>
          {/* Navigate back to the menu */}
          <button
            onClick={() => {
              navigate("/", { replace: true });
            }} className="green-button">
            Go to Menu
          </button>
        </div>
      )}
    </>
  );
}
