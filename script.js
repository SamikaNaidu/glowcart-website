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

// Get cart from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Add to cart function (with quantity support)
function addToCart(name, price) {
  let cart = getCart();

  // Check if item already exists
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name: name, price: price, quantity: 1 });
  }

  saveCart(cart);
  showToast(name + " added to cart");
}

// Display cart items (for cart.html)
function loadCart() {
  let cart = getCart();
  let cartItemsDiv = document.getElementById("cart-items");
  let totalDiv = document.getElementById("cart-total");

  if (!cartItemsDiv || !totalDiv) return; // Not on cart page

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

// Load cart when page opens
document.addEventListener("DOMContentLoaded", function () {
  loadCart();
});

// Toast notification
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.innerText = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}
