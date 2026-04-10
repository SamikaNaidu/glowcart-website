// Load header
fetch("header.html")
  .then(res => res.text())
  .then(data => {
    const headerDiv = document.getElementById("header");
    if (headerDiv) headerDiv.innerHTML = data;
  });

// Load footer
fetch("footer.html")
  .then(res => res.text())
  .then(data => {
    const footerDiv = document.getElementById("footer");
    if (footerDiv) footerDiv.innerHTML = data;
  });

// Get cart
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save cart
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Add to cart
function addToCart(name, price) {
  let cart = getCart();

  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name: name, price: price, quantity: 1 });
  }

  saveCart(cart);
  showToast(name + " added to cart");
}

// Load cart
function loadCart() {
  let cart = getCart();
  let cartItemsDiv = document.getElementById("cart-items");
  let totalDiv = document.getElementById("cart-total");

  if (!cartItemsDiv || !totalDiv) return;

  cartItemsDiv.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
    totalDiv.innerText = "Total: ₹0";
    return;
  }

  cart.forEach((item, index) => {
    let div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <span><strong>${item.name}</strong> (x${item.quantity})</span>
      <span>₹${item.price * item.quantity}</span>
      <button onclick="removeFromCart(${index})">Remove</button>
    `;

    cartItemsDiv.appendChild(div);
    total += item.price * item.quantity;
  });

  totalDiv.innerText = "Total: ₹" + total;
}

// Remove item
function removeFromCart(index) {
  let cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  loadCart();
}

// Toast
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.innerText = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

// 🔥 UPDATED: Load products with CATEGORY SUPPORT
async function loadProducts(category = null) {
  try {
    let url = "http://localhost:3000/products";

    if (category) {
      url += `?category=${encodeURIComponent(category)}`;
    }

    const response = await fetch(url);
    const products = await response.json();

    const container = document.getElementById("product-list");
    if (!container) return;

    container.innerHTML = "";

    products.forEach(product => {
      container.innerHTML += `
        <div class="product-card">
          <img src="${product.image}" class="product-image" />
          <h3>${product.name}</h3>
          <p>₹${product.price}</p>
          <button onclick="addToCart('${product.name}', ${product.price})">
            Add to Cart
          </button>
        </div>
      `;
    });

  } catch (error) {
    console.error("Error loading products:", error);
  }
}

// 🔥 MAIN CONTROLLER (THIS IS THE MAGIC)
document.addEventListener("DOMContentLoaded", function () {
  loadCart();

  const productContainer = document.getElementById("product-list");
  if (!productContainer) return;

  const path = window.location.pathname;

  if (path.includes("makeup.html")) {
    loadProducts("Makeup");
  } else if (path.includes("skincare.html")) {
    loadProducts("Skincare & Beauty");
  } else if (path.includes("hair.html")) {
    loadProducts("Hair");
  } else if (path.includes("fragrance.html")) {
    loadProducts("Fragrance");
  } else {
    loadProducts(); // shop page (all products)
  }
});