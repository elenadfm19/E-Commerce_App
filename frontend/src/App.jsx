import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import Menu from "./features/menu/Menu.jsx";
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import Logout from './components/Logout.jsx';
import Profile from './components/Profile.jsx';
import Orders from './features/orders/Orders.jsx';
import Cart from './features/cart/Cart.jsx';


export default function App() {
  return (
    <>
      {/* Routes defines all available client-side routes */}
      <Routes>
        {/* Global route that shows the permanent navigation bar. It nests the rest of the routes */}
        <Route path="/" element={<Home />}>

          {/* Menu page */}
          <Route path="menu" element={<Menu />} />

          {/* Shopping cart details page */}
          <Route path="cart" element={<Cart />} />

          {/* User authentication routes */}
          <Route path="users/register" element={<Register />} />
          <Route path="users/login" element={<Login />} />
          <Route path="users/logout" element={<Logout />} />

          {/* User profile page */}
          <Route path="users/profile" element={<Profile />} />

          {/*
            Orders list page
            URL: /orders
          */}
          <Route path="orders" element={<Orders />} />

          {/*
            Single order details page
            URL: /orders/:orderId
            - Uses the same Orders component
            - orderId can be accessed via useParams()
          */}
          <Route path="orders/:orderId" element={<Orders />} />

        </Route>
      </Routes>
    </>
  );
}

