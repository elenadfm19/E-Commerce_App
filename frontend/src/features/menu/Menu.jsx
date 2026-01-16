import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// Menu slice selectors and thunks
import {
  selectMenu,
  selectLoading,
  selectError,
  fetchMenu,
} from "./menuSlice.jsx";
// Cart slice selectors and thunks
import {
  selectCart,
  selectCartStatus,
  createCart,
  fetchCartStatus,
  fetchCart,
  addItemToCart,
  removeItemFromCart,
  deleteCart,
} from "../cart/cartSlice.jsx";
import { useAuth } from "../../auth/useAuth";

export default function Menu() {
  /**
   * Redux state selectors
   */
  const menu = useSelector(selectMenu);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const cart = useSelector(selectCart);
  const cartStatus = useSelector(selectCartStatus);
  // Authenticated user from AuthContext
  const { user, setUser } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // ['starter','main','dessert']
  const types = [...new Set(menu.map((item) => item.type))];

  /**
   * Fetch menu items once when the component mounts
   */
  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  /**
   * After a user logs in, fetch the cart status
   * (to check if a cart already exists)
   */
  useEffect(() => {
    if (user) {
      dispatch(fetchCartStatus()); // fetch cart status after login
    }
  }, [dispatch, user]);

  /**
   * When a cart exists (cartStatus.id),
   * fetch the cart items
   */
  useEffect(() => {
    if (cartStatus.id) {
      dispatch(fetchCart({ cartId: cartStatus.id })); // fetch cart items
    }
  }, [dispatch, cartStatus.id]);

  /**
   * Helper function to find how many units
   * of a given item are currently in the cart
   */
  const findItemQuantity = (itemId) => {
    if (cartStatus.id) {
      const itemObject = cart.find((row) => row.item_id === itemId);
      const quantity = itemObject ? itemObject.quantity : 0;
      return quantity;
    }
    return 0;
  };
  // Loading state while fetching menu
  if (loading) return <p>Loading menu...</p>;
  // Error state if menu fetch fails
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <h1 id="menu">Menu</h1>
      {/* User is logged in but has no active cart */}
      {user && !cartStatus.id && (
        <div id='menu-buttons'>
          {/* Create a new cart */}
          <button
            onClick={() => dispatch(createCart())}
            className='green-button'
          >
            Create Cart
          </button>
          {/* Navigate to orders page */}
          <button
            onClick={() => navigate("/orders", { replace: true })}
            className='green-button'
          >
            View orders
          </button>
        </div>
      )}
      {/* Display cart summary if user has an active cart*/}
      {cartStatus.id && (
        <div id="cart-summary">
          <p>Cart summary</p>
          <p>Items in the cart:{cartStatus.totalItems}</p>
          <p>Total cost:{cartStatus.totalCost}</p>
          {/* Allow ordering only if cart has items */}
          {cartStatus.totalCost > 0 && (
            <button onClick={() => navigate("/cart")} className='green-button'>
              View Cart
            </button>
          )}
          <button
            onClick={() => dispatch(deleteCart())}
            className='green-button'
          >
            Discard Cart
          </button>
        </div>
      )}

      {/* Menu items list */}
      <div id="menu">
        {/* Menu sections */}
        {types.map((type) => (
          <div id={type} className="menu-section">
            <p>&bull;&bull; {type.charAt(0).toUpperCase() + type.slice(1)}</p>
            {/* Items per section */}
            {menu
              .filter((item) => item.type === type)
              .map((item) => {
                return (
                  <div className="menu-item" id={item.id}>
                    <p>{item.name}</p>
                    <div className="price-buttons">
                      <p className='space'> {item.price} €&nbsp;&nbsp;&nbsp;&nbsp;</p>
                      <div className="add-remove-buttons">
                        {/* Remove item from cart */}
                        {cartStatus.id && (
                          <button
                            onClick={() => {
                              dispatch(removeItemFromCart({ itemId: item.id }));
                            }}
                            className="quantity-button"
                          >
                            -
                          </button>
                        )}
                        {/* Display item quantity in cart */}
                        {cartStatus.id && (
                          <p className="quantity">
                            {findItemQuantity(item.id)}
                          </p>
                        )}
                        {/* Add item to cart */}
                        {cartStatus.id && (
                          <button
                            onClick={() => {
                              dispatch(addItemToCart({ itemId: item.id }));
                            }}
                            className="quantity-button"
                          >
                            +
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </>
  );
}
