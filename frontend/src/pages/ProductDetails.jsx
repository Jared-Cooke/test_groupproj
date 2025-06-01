import { useParams, Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext.jsx";
import { useEffect, useState } from "react";
import { fetchProductById } from "../api/index.js";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const placeholderImg =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUQftyztzi5Tlcchdc4z24ud0183IAYXMYHAyf4vfqtUWS-1UKDnzQ80eL6sY1oPTEsdk&usqp=CAU";

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (e) {
        console.error("Failed to fetch product:", e);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      addToCart({ ...product, quantity });
      alert(`${product.name} (x${quantity}) added to cart`);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <h3>Loading...</h3>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="card">
        <h3>Product not found.</h3>
      </div>
    );
  }

  return (
    <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
      <div>
        <Link to="/">← Back to Products</Link>
      </div>
      <h2>{product.name}</h2>

      <img
        src={product.image_url || placeholderImg}
        alt={product.name}
        style={{
          width: "250px",
          height: "250px",
          objectFit: "cover",
          marginBottom: "1rem",
        }}
      />

      <p style={{ fontStyle: "italic" }}>
        {product.description || "No description provided."}
      </p>

      <p>
        <strong>Price:</strong> ${product.price}
      </p>

      {product.stock !== undefined && (
        <p>
          <strong>Stock:</strong>{" "}
          {product.stock === 0 ? "Out of Stock" : product.stock}
        </p>
      )}

      {product.stock > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Quantity:{" "}
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              style={{
                width: "60px",
                padding: "0.25rem",
                fontSize: "1rem",
              }}
            />
          </label>
        </div>
      )}

      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        style={{ marginBottom: "1rem" }}
      >
        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
}

export default ProductDetails;
