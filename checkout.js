let cart = JSON.parse(localStorage.getItem("grillzillaCart")) || [];

// cache controls
const paymentSelect = document.getElementById("paymentMethod");
const pickupSelect = document.getElementById("pickupOption");
const addressGroup = document.getElementById("addressGroup");
const cardNumGroup = document.getElementById("cardNumInput");
const cardExpGroup = document.getElementById("cardExp");
const cardSecGroup = document.getElementById("cardSec");
const receiptTotal = document.getElementById("receiptTotal");

// show/hide based on selections
function updateVisibility() {
  const pay = paymentSelect?.value || "creditCard";
  const pickup = pickupSelect?.value || "pickup";

  const showCard = pay === "creditCard";
  cardNumGroup.style.display = showCard ? "" : "none";
  cardExpGroup.style.display = showCard ? "" : "none";
  cardSecGroup.style.display = showCard ? "" : "none";

  const requiresAddress = pickup === "deliver";
  addressGroup.style.display = requiresAddress ? "" : "none";
}

// ensure controls exist before wiring events
function initUI() {
  if (paymentSelect) paymentSelect.addEventListener("change", updateVisibility);
  if (pickupSelect) pickupSelect.addEventListener("change", updateVisibility);
  updateVisibility();
}

// Calculate Rewards
function calculateRewardDiscount(rewardName) {
  const discountMap = {
    "Free Small Drink": 0,
    "Free Side Order (Fries or Onion Rings)": 0,
    "$5 Off Your Order": 5,
    "Free Appetizer (Up to $8.99)": 0,
    "$10 Off Your Order": 10,
    "Free Entrée (Up to $12.99)": 0,
    "Free Dessert + $5 Off": 5,
    "$20 Off Your Order": 20
  };
  return discountMap[rewardName] || 0;
}

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

  // Get redeemed rewards and calculate discount
  const redeemedRewards = JSON.parse(localStorage.getItem("redeemedRewards")) || [];
  let totalDiscount = 0;
  redeemedRewards.forEach(reward => {
    totalDiscount += calculateRewardDiscount(reward);
  });

  // Display subtotal, discount, and final total
  const subtotalRow = document.createElement("div");
  subtotalRow.classList.add("subtotal-row");
  subtotalRow.innerHTML = `
    <span>Subtotal</span>
    <span>$${total.toFixed(2)}</span>
  `;
  summary.appendChild(subtotalRow);

  if (totalDiscount > 0) {
    const discountRow = document.createElement("div");
    discountRow.classList.add("discount-row");
    discountRow.innerHTML = `
      <span>Rewards Discount</span>
      <span>-$${totalDiscount.toFixed(2)}</span>
    `;
    summary.appendChild(discountRow);
  }

  const finalTotal = Math.max(0, total - totalDiscount);
  receiptTotal.textContent = `$${finalTotal.toFixed(2)}`;
}

function generateOrderNumber() {
    return "ORD-" + Date.now();
  }

function placeOrder() {
  const name = document.getElementById("fullName").value.trim();
  const paymentMethod = document.getElementById("paymentMethod").value;
  const pickupType = document.getElementById("pickupOption").value;

  // conditional fields
  const needsAddress = pickupType === "deliver";
  const needsCard = paymentMethod === "creditCard";

  const card = needsCard ? document.getElementById("cardNumber").value.trim().replace(/\s/g, "") : "";
  const exp = needsCard ? document.getElementById("expDate").value.trim() : "";
  const cvc = needsCard ? document.getElementById("cvc").value.trim() : "";
  const address = needsAddress ? document.getElementById("address").value.trim() : "";

  // basic required checks
  if (!name || (needsCard && (!card || !exp || !cvc)) || (needsAddress && !address)) {
    alert("Please fill in all required payment/shipping fields.");
    return;
  }

  // card validation only if needed
  if (needsCard) {
    if (card.length !== 16 || !/^\d+$/.test(card)) {
      alert("Card number must be 16 digits.");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(exp)) {
      alert("Expiration date must be in MM/YY format.");
      return;
    }
    if (!/^\d{3,4}$/.test(cvc)) {
      alert("CVC must be 3-4 digits.");
      return;
    }
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

  if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => { initUI(); loadOrder(); });
} else {
  initUI();
  loadOrder();
}
