let cart = JSON.parse(localStorage.getItem("grillzillaCart")) || [];

function loadOrder() {
const summary = document.getElementById("orderSummary");
const totalBox = document.getElementById("orderTotal");

if (cart.length === 0) {
summary.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
return;
}

let total = 0;
summary.innerHTML = "";

cart.forEach(item => {
total += item.price * item.quantity;

const row = document.createElement("div");
row.classList.add("cart-item");
row.innerHTML = `
<span>${item.quantity}× ${item.name}</span>
<span>$${(item.price * item.quantity).toFixed(2)}</span>
`;
summary.appendChild(row);
});

totalBox.textContent = `$${total.toFixed(2)}`;
}

function generateOrderNumber() {
    return "ORD-" + Date.now();
  }

function placeOrder() {
const name = document.getElementById("fullName").value;
const card = document.getElementById("cardNumber").value;
const exp = document.getElementById("expDate").value;
const cvc = document.getElementById("cvc").value;

if (!name || !card || !exp || !cvc) {
alert("Please fill in all payment fields.");
return;
}

  // Validate card number format (basic check)
// if (card.length !== 16 || !/^\d{16}$/.test(card)) {
//     alert("Card number must be 16 digits.");
//     return;
// }

  // Validate expiration date format
if (!/^\d{2}\/\d{2}$/.test(exp)) {
    alert("Expiration date must be in MM/YY format.");
    return;
}

  // Validate CVC
if (!/^\d{3,4}$/.test(cvc)) {
    alert("CVC must be 3-4 digits.");
    return;
}

console.log("Order placed by:", name);

alert("Payment successful! Your order has been placed.");

// Generate receipt
    const orderNumber = generateOrderNumber();
    displayReceipt(orderNumber, name);

    // Hide checkout form, show receipt
    document.getElementById("checkout-container").style.display = "none";
    document.getElementById("receiptSection").style.display = "block";

    // Clear cart (but keep it for receipt display)
    localStorage.removeItem("grillzillaCart");
    cart = []; // Clear in-memory cart
  }

  function displayReceipt(orderNumber, customerName) {
    const receiptItems = document.getElementById("receiptItems");
    const receiptTotal = document.getElementById("receiptTotal");
    const orderNumberSpan = document.getElementById("orderNumber");
    const receiptRewards = document.getElementById("receiptRewards");

    orderNumberSpan.textContent = orderNumber;
    receiptItems.innerHTML = "";

    let total = 0;
    const savedCart = JSON.parse(localStorage.getItem("grillzillaCart")) || cart;

    savedCart.forEach(item => {
      total += item.price * item.quantity;

      const row = document.createElement("div");
      row.classList.add("receipt-item");
      row.innerHTML = `
        <span>${item.quantity}× ${item.name}</span>
        <span>$${(item.price * item.quantity).toFixed(2)}</span>
      `;
      receiptItems.appendChild(row);
    });

    receiptTotal.textContent = `$${total.toFixed(2)}`;

    // Display redeemed rewards
    const redeemedRewards = JSON.parse(localStorage.getItem("redeemedRewards")) || [];
    if (redeemedRewards.length > 0) {
      receiptRewards.innerHTML = `
        <h3>Redeemed Rewards:</h3>
        <ul>
          ${redeemedRewards.map(reward => `<li>${reward}</li>`).join("")}
        </ul>
      `;
    }
  }

  function returnToMenu() {
    window.location.href = "Menu.html";
  }

loadOrder();
