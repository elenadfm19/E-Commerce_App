import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import HomeIntro from "./HomeIntro";

/**
 * Home component
 *
 * Acts as the layout for the application:
 * - Displays the top navigation bar
 * - Handles navigation logic
 * - Renders nested routes using <Outlet />
 */
export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  // Access authenticated user from AuthContext
  const { user, setUser } = useAuth();
  // Local UI state flags used to trigger navigation
  const [login, setLogin] = useState(false);
  const [logout, setLogout] = useState(false);
  const [register, setRegister] = useState(false);
  const [profile, setProfile] = useState(false);

  /**
   * useEffect handles all navigation side effects.
   *
   * - Redirects '/' → '/menu'
   * - Redirects when Login / Logout / Register / Profile buttons are clicked
   */
  useEffect(() => {
    // Navigate to login page
    if (login) {
      setLogin(false);
      navigate("users/login");
    }
    // Navigate to logout page
    if (logout) {
      setLogout(false);
      navigate("users/logout");
    }
    // Navigate to register page
    if (register) {
      setRegister(false);
      navigate("users/register");
    }
    // Navigate to profile page
    if (profile) {
      setProfile(false);
      console.log("entro a profile");
      navigate("users/profile");
    }
  }, [location, login, logout, register, user, profile]);

  return (
    <>
      {/* Top navigation bar */}
      <div className="home-bar">
        <div id="bar1">
          {user ? (
            <div>
              <p id='welcome'>
                Welcome {user.firstname} {user.lastname}
              </p>
              <button
                onClick={(e) => {
                  setProfile(true);
                }} id='profile-button'
              >
                Profile
              </button>
            </div>
          ) : (
            // If the user is NOT logged in
            <div></div>
          )}
        </div>
        <div id="bar2" onClick={()=>navigate('/')}>
          <h1>Nonna di Napoli</h1>
        </div>
        <div id="bar3">
          {/* If the user is logged in */}
          {user ? (
            <div>
              <button
                onClick={(e) => {
                  setLogout(true);
                }} id='logout-button'
              >
                Logout
              </button>
            </div>
          ) : (
            // If the user is NOT logged in
            <div>
              <button
                onClick={(e) => {
                  setLogin(true);
                }}
                id="login-button"
              >
                Login
              </button>{" "}
              <button
                onClick={(e) => {
                  setRegister(true);
                }}
                id="register-button"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Outlet renders nested routes (Menu, Cart, Orders, etc.) */}
      {location.pathname === "/" ? (
        <HomeIntro />
      ) : (
        <Outlet key={location.key} />
      )}
    </>
  );
}
