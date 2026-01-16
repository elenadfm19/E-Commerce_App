import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// Cart slice selectors and action
import { selectCartStatus, selectCart, resetCart } from "./cartSlice.jsx";
// Orders slice thunk to create a new order
import { createOrder } from "../orders/orderSlice.jsx";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Select cart metadata (id, totals, etc.)
  const cartStatus = useSelector(selectCartStatus);
  // Select cart items array
  const cart = useSelector(selectCart);

  /**
   * Handles order confirmation:
   * 1. Creates a new order from the current cart
   * 2. Resets the cart state in Redux
   */
  function handleSubmit() {
    dispatch(createOrder());
    dispatch(resetCart());
  }

  return (
    <>
      <div id="cart">
        <h1>Cart summary</h1>
        {/* If there is an active cart */}
        {cartStatus.id && (
          <div>
              {/* Display cart items */}
              {cart.map((item) => {
                return (
                  <div id={item.item_id} className="cart-item">
                    <p>{item.name}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: {item.price}</p>
                  </div>
                );
              })}
            <div id='cart-details'>
              <p>Items in the cart:{cartStatus.totalItems}</p>
              <p>Total cost:{cartStatus.totalCost}</p>
            </div>
            {/* Confirm order button */}
            <button onClick={() => handleSubmit()} className="green-button">
              Confirm order
            </button>
            {/* Navigate back to menu */}
            <button onClick={() => navigate("/menu")} className="green-button">
              Go back to cart
            </button>
          </div>
        )}
        {!cartStatus.id && (
          <div id='order-success'>
            <p>Your order has been processed!</p>
            <button onClick={() => navigate("/menu")} className='green-button'>Go back to Menu</button>
          </div>
        )}
      </div>
    </>
  );
}
