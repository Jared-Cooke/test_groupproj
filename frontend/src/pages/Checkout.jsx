import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    card: "",
    cardName: "",
    cardExpiry: "",
    cvc: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    shipping: "standard",
  });

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const inputStyle = {
    width: "100%",
    padding: "2px",
    backgroundColor: "#fff",
    color: "black",
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateStep = () => {
    let newErrors = {};
    if (step === 1) {
      if (!form.name.trim()) newErrors.name = "Name is required.";
      if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
        newErrors.email = "Valid email is required.";
    } else if (step === 2) {
      if (!form.card.trim()) newErrors.card = "Card number is required.";
      else if (!/^\d{16}$/.test(form.card))
        newErrors.card = "Card must be 16 digits.";
      if (!form.cardName.trim())
        newErrors.cardName = "Name on card is required.";
      if (
        !form.cardExpiry.trim() ||
        !/^(0[1-9]|1[0-2])\/(\d{2})$/.test(form.cardExpiry)
      )
        newErrors.cardExpiry = "Expiry must be MM/YY.";
      if (!form.cvc.trim() || !/^\d{3}$/.test(form.cvc))
        newErrors.cvc = "CVC must be 3 digits.";
    } else if (step === 3) {
      if (!form.street.trim()) newErrors.street = "Street address is required.";
      if (!form.city.trim()) newErrors.city = "City is required.";
      if (!form.state.trim()) newErrors.state = "State is required.";
      if (!form.postalCode.trim())
        newErrors.postalCode = "Postal code is required.";
      if (!form.country.trim()) newErrors.country = "Country is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep()) setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const getTotal = () => {
    return cartItems.reduce(
      (sum, item) =>
        sum + parseFloat(item.price?.replace?.(/\$/g, "") || item.price || 0),
      0
    );
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setSubmitted(true);
    console.log("Order submitted:", form, cartItems);
  };

  return (
    <div className="card">
      <h2>Checkout</h2>
      <h3>Step {step} of 4</h3>

      {submitted ? (
        <div>
          <h3>Order Confirmed!</h3>
          <p>
            Thank you, {form.name}. A confirmation email was sent to{" "}
            <b>{form.email}</b>.
          </p>
          <button onClick={() => navigate("/")}>Return to Home</button>
        </div>
      ) : (
        <form onSubmit={step === 4 ? handlePlaceOrder : handleNext}>
          {step === 1 && (
            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{ flex: 1 }}>
                <label>Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  style={inputStyle}
                />
                {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
              </div>
              <div style={{ flex: 1 }}>
                <label>Email</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  style={inputStyle}
                />
                {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div>
                <label>Card Number</label>
                <input
                  name="card"
                  value={form.card}
                  onChange={handleChange}
                  placeholder="1234123412341234"
                  maxLength="16"
                  style={inputStyle}
                />
                {errors.card && <p style={{ color: "red" }}>{errors.card}</p>}
              </div>
              <div>
                <label>Name on Card</label>
                <input
                  name="cardName"
                  value={form.cardName}
                  onChange={handleChange}
                  style={inputStyle}
                />
                {errors.cardName && (
                  <p style={{ color: "red" }}>{errors.cardName}</p>
                )}
              </div>
              <div>
                <label>Expiry (MM/YY)</label>
                <input
                  name="cardExpiry"
                  value={form.cardExpiry}
                  onChange={handleChange}
                  style={inputStyle}
                />
                {errors.cardExpiry && (
                  <p style={{ color: "red" }}>{errors.cardExpiry}</p>
                )}
              </div>
              <div>
                <label>CVC</label>
                <input
                  name="cvc"
                  value={form.cvc}
                  onChange={handleChange}
                  maxLength="3"
                  style={inputStyle}
                />
                {errors.cvc && <p style={{ color: "red" }}>{errors.cvc}</p>}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div>
                <label>Street</label>
                <input
                  name="street"
                  value={form.street}
                  onChange={handleChange}
                  style={inputStyle}
                />
                {errors.street && (
                  <p style={{ color: "red" }}>{errors.street}</p>
                )}
              </div>
              <div>
                <label>City</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  style={inputStyle}
                />
                {errors.city && <p style={{ color: "red" }}>{errors.city}</p>}
              </div>
              <div>
                <label>State</label>
                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  style={inputStyle}
                />
                {errors.state && <p style={{ color: "red" }}>{errors.state}</p>}
              </div>
              <div>
                <label>Postal Code</label>
                <input
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  style={inputStyle}
                />
                {errors.postalCode && (
                  <p style={{ color: "red" }}>{errors.postalCode}</p>
                )}
              </div>
              <div>
                <label>Country</label>
                <input
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  style={inputStyle}
                />
                {errors.country && (
                  <p style={{ color: "red" }}>{errors.country}</p>
                )}
              </div>
              <div>
                <label>Shipping</label>
                <select
                  name="shipping"
                  value={form.shipping}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="standard">Standard Delivery (Free)</option>
                  <option value="express">Express Delivery ($10)</option>
                </select>
              </div>
            </div>
          )}

          {step === 4 && (
            <>
              <h3>Order Summary</h3>
              {cartItems.map((item, idx) => (
                <div key={idx}>
                  {item.name} — $
                  {parseFloat(item.price?.replace?.(/\$/g, "") || item.price)}
                </div>
              ))}
              <p>
                <strong>Total:</strong> ${getTotal().toFixed(2)}
              </p>
            </>
          )}

          <div style={{ marginTop: "1rem" }}>
            {step > 1 && step <= 4 && (
              <button
                type="button"
                onClick={handleBack}
                style={{ marginRight: "1rem", marginLeft: "1rem" }}
              >
                ← Back
              </button>
            )}
            <button type="submit">
              {step === 4 ? "Place Order" : "Next →"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Checkout;
