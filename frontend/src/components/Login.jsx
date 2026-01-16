import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
// Backend base URL loaded from Vite environment variables
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Login component
 *
 * Handles user authentication by:
 * - Collecting login credentials
 * - Sending them to the backend
 * - Storing the authenticated user in context
 * - Redirecting the user after successful login
 */
export default function Login() {
  // Controlled input state for the email field
  const [email, setEmail] = useState("");
  // Controlled input state for the password field
  const [password, setPassword] = useState("");
  // Toggles whether the password is visible or hidden
  const [showPassword, setShowPassword] = useState(false);
  // Stores error messages to show to the user
  const [error, setError] = useState(null);
  // Access setUser from AuthContext to store logged-in user data
  const { setUser } = useAuth();
  const navigate = useNavigate();

  /**
   * Handles form submission.
   * Sends login credentials to the backend,
   * stores the authenticated user in context,
   * and redirects to the home/menu page.
   */
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Backend expects username + password
        body: JSON.stringify({ username: email, password: password }),
        // Allows cookies (session) to be sent/received
        credentials: "include",
      });
      const data = await res.json();
      // If login was successful
      if (res.status == 200) {
        // Store user info in AuthContext
        setUser({
          id: data.user.id,
          email: data.user.email,
          firstname: data.user.firstname,
          lastname: data.user.lastname,
          address: data.user.address,
        });
        navigate("/", { replace: true });
      }
    } catch (error) {
      setError("An error has happened. Please try to login again.");
    }
  }

  // Show error message if something went wrong
  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      {/* Login form */}
      <form onSubmit={handleSubmit} className='form'>
        {/* Email input */}
        <input
          id="email"
          type="text"
          value={email}
          placeholder="E-mail"
          onChange={(e) => setEmail(e.target.value)}
        />
        {/* Password input (toggleable visibility) */}
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* Toggle password visibility */}
        <button
          id="showPassword"
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? "Hide Password" : "Show Password"}
        </button>
        {/* Submit login form */}
        <button>Login</button>
      </form>
    </>
  );
}
