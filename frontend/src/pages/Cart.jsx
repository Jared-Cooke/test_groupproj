import { useCart } from "../contexts/CartContext.jsx";
import { Link } from "react-router-dom";

function Cart() {
  const { cartItems, removeFromCart } = useCart();

  // Utility: safely parse price
  const parsePrice = (price) =>
    typeof price === "string" ? parseFloat(price.replace(/\$/g, "")) : price;

  // Calculate total
  const total = cartItems.reduce(
    (sum, item) => sum + parsePrice(item.price) * (item.quantity || 1),
    0
  );

  return (
    <div className="card">
      <h2>Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <div>
          <p>Your cart is empty.</p>
          <Link to="/"> ←Browse Products</Link>
        </div>
      ) : (
        <div>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {cartItems.map((item, index) => {
              const price = parsePrice(item.price);
              const quantity = item.quantity || 1;
              return (
                <li
                  key={index}
                  style={{
                    marginBottom: "1.5rem",
                    borderBottom: "1px solid #ccc",
                    paddingBottom: "1rem",
                  }}
                >
                  <strong>{item.name}</strong>
                  <div>
                    Price: ${price} × {quantity}
                  </div>
                  <div>Subtotal: ${(price * quantity).toFixed(2)}</div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{ marginTop: "0.5rem" }}
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>

          <h3>Total: ${total.toFixed(2)}</h3>

          <div style={{ marginTop: "1rem" }}>
            <Link to="/checkout">
              <button>Proceed to Checkout</button>
            </Link>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <Link to="/">← Continue Shopping</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
