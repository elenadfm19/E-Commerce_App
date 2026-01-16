import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// Order slice selectors and thunks
import {
  selectOrderList,
  selectOrder,
  fetchOrderList,
  fetchOrder,
} from "./orderSlice.jsx";

export default function Orders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Extract orderId from the URL ("/orders/:orderId")
  const { orderId } = useParams();
  // Select list of all orders from Redux
  const orderList = useSelector(selectOrderList);
  // Select details of a single order from Redux
  const order = useSelector(selectOrder);

  /**
   * Fetches data depending on the route:
   * - If no orderId exists → fetch all orders
   * - If orderId exists → fetch details for that specific order
   */
  useEffect(() => {
    if (!orderId) {
      dispatch(fetchOrderList());
    } else {
      dispatch(fetchOrder({ orderId: orderId }));
    }
  }, [dispatch, orderId]);

  return (
    <>
      {/* ORDER LIST VIEW ( /orders ) */}
      {!orderId && (
        <div id="orderList">
          {orderList.map((item) => {
            return (
              <div className="order" id={item.id}>
                <p>Order id: {item.id}</p>
                <p>Total items: {item.total_items}</p>
                <p>Total cost: {item.total_cost}</p>
                <p>Created: {new Date(item.created).toLocaleString()}</p>
                {/* Navigate to order details */}
                <button onClick={() => navigate(`${item.id}`)} className='green-button'>
                  View order details
                </button>
              </div>
            );
          })}
          {/* Navigate back to menu */}
          <button onClick={() => navigate("/menu")} className='green-button'>Back to menu</button>
        </div>
      )}
      {/* ORDER DETAILS VIEW ( /orders/:orderId ) */}
      {orderId && (
        <div id='selected-order'>
          {order.map((item) => {
            return (
              <div id={item.item_id} className="order-details">
                <p>{item.name}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Price: {item.price}</p>
              </div>
            );
          })}
          {/* Navigate back to orders list */}
          <button onClick={() => navigate("/orders")} className='green-button'>Back to orders</button>
        </div>
      )}
    </>
  );
}
