import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
// Backend base URL loaded from Vite environment variables
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Register component
 * Handles user registration by collecting form data,
 * sending it to the backend, and logging the user in on success.
 */
export default function Register() {
  // Form state for user credentials and profile data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  // Stores error messages to show to the user
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // Setter to update authenticated user in AuthContext
  const { setUser } = useAuth();

  /**
   * Handles form submission:
   * 1. Sends registration data to the backend
   * 2. Handles conflict or success responses
   * 3. Logs the user in automatically on success
   */
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      // Send registration request to backend
      const res = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName, address }),
        credentials: "include", // Allows backend to set session cookie
      });
      const data = await res.json();
      // If user already exists, backend returns 409
      if (res.status == 409) {
        setError(data);
      }
      // If registration is successful
      if (res.status == 201) {
        // Store user data in AuthContext
        setUser({
          id: data.user.id,
          email: data.user.email,
          firstname: data.user.firstname,
          lastname: data.user.lastname,
          address: data.user.address,
        });
        // Redirect user to the menu page
        navigate("/menu");
      }
    } catch (error) {
      setError("An error has happened. Please try to register again.");
    }
  }

  // Display error message if something went wrong
  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      {/* Registration form */}
      <form onSubmit={handleSubmit} className='form'>
        <input
          id="email"
          type="text"
          value={email}
          placeholder="E-mail"
          onChange={(e) => setEmail(e.target.value)}
        />
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
        <input
          id="firstName"
          type="text"
          value={firstName}
          placeholder="First Name"
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          id="lastName"
          type="text"
          value={lastName}
          placeholder="Last Name"
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          id="address"
          type="text"
          value={address}
          placeholder="Address"
          onChange={(e) => setAddress(e.target.value)}
        />
        {/* Submit registration form */}
        <button>Register</button>
      </form>
    </>
  );
}
