const BASE = "http://127.0.0.1:8000";

//Products (tries backend, fallback to mock)
export async function fetchProducts(search = "") {
  try {
    const res = await fetch(`${BASE}/searchitems?search=${search}`);
    if (!res.ok) throw new Error("Backend error");
    return await res.json();
  } catch (e) {
    console.warn("Backend unavailable, using mock data:", e.message);

    return [
      { id: 1, name: "iPhone 15", price: 999 },
      { id: 2, name: "Samsung Galaxy S24", price: 899 },
      { id: 3, name: "MacBook Air", price: 1299 },
      { id: 4, name: "iPad Pro", price: 109 },
      { id: 5, name: "iMac Pro", price: 1350 },
    ];    
  }
}

//Login (Mock with validation)
export async function loginUser(credentials) {
  const { username, password } = credentials;

  //username: starts with letter, 5+ characters
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{4,}$/;
  //password: 8+ chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  if (!usernameRegex.test(username)) {
    throw new Error(
      "Username must start with a letter, be at least 5 characters, and contain only letters, numbers, or underscores."
    );
  }

  if (!passwordRegex.test(password)) {
    throw new Error(
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
    );
  }

  const fakeUsers = [
    { username: "admin", password: "Admin123!", role: "admin" },
    { username: "user1", password: "User1234!", role: "customer" },
    { username: "user2", password: "User4567@", role: "customer" },
  ];

  const match = fakeUsers.find(
    (u) => u.username === username && u.password === password
  );

  if (!match) {
    throw new Error("Invalid username or password");
  }

  return {
    token: "mock-token",
    username: match.username,
    role: match.role,
  };
}

//Order Submission (Stub)
export async function submitOrder(orderData) {
  console.log("Order submitted:", orderData);
  return Promise.resolve({ status: "success" });
}

//Get product by ID (stub)
export async function fetchProductById(id) {
  const products = await fetchProducts();
  return products.find((p) => p.id == id);
}

export function logoutUser() {
  localStorage.removeItem("session");
}
