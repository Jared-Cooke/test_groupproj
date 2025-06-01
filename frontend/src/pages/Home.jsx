import { useEffect, useState } from "react";
import { fetchProducts } from "../api/index.js";
import { Link } from "react-router-dom";

function Home() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;

  const placeholderImg =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUQftyztzi5Tlcchdc4z24ud0183IAYXMYHAyf4vfqtUWS-1UKDnzQ80eL6sY1oPTEsdk&usqp=CAU";

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((err) => setError(err.message));
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };

  return (
    <div className="card">
      <h2>Available Products</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, min(380px, 480px))",
              justifyContent: "center",
              gap: "1.5rem",
            }}
          >
            {currentProducts.map((product) => (
              <div
                key={product.id}
                style={{
                  border: "1px solid #000",
                  borderRadius: "18px",
                  padding: "1rem",
                  backgroundColor: "white",
                  textAlign: "center",
                }}
              >
                <img
                  src={product.image_url || placeholderImg}
                  alt={product.name}
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    marginBottom: "0.75rem",
                  }}
                />
                <h3>{product.name}</h3>
                <p>
                  <strong>${product.price}</strong>
                </p>
                <Link
                  to={`/product/${product.id}`}
                  style={{ color: "#457B9D" }}
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => handlePageChange(num)}
                style={{
                  margin: "0 5px",
                  padding: "0.5rem 1rem",
                  backgroundColor: currentPage === num ? "#457B9D" : "#eee",
                  color: currentPage === num ? "white" : "black",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                {num}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
