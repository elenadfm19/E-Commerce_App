import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import store from "./store.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx"; // Authentication context provider (user, login, logout, etc.)

// Create the React root and render the app
createRoot(document.getElementById("root")).render(
  // Provides Redux state to the entire app
  <Provider store={store}>
    {/* Provides authentication state and helpers */}
    <AuthProvider>
      {/* Enables routing using the browser URL */}
      <BrowserRouter>
        {/* Main application component */}
        <App />
      </BrowserRouter>
    </AuthProvider>
  </Provider>
);
