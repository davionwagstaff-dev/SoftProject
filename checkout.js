let cart = JSON.parse(localStorage.getItem("grillzillaCart")) || [];

// cache controls
const paymentSelect = document.getElementById("paymentMethod");
const pickupSelect = document.getElementById("pickupOption");
const addressGroup = document.getElementById("addressGroup");
const cardNumGroup = document.getElementById("cardNumInput");
const cardExpGroup = document.getElementById("cardExp");
const cardSecGroup = document.getElementById("cardSec");
const receiptTotal = document.getElementById("receiptTotalAmount");

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
// 
function calculateRewardDiscount(rewardName) {
  const discountMap = {
    "Free Small Drink": 0,
    "Free Side": 0,
    "$5 Off Total Order": 5,
    "Free Appetizer": 0,
    "$10 Off Total Order": 10,
    "Free Entrée": 0,
    "Free Dessert": 0,
    "$20 Off Total Order": 20
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
  totalBox.textContent = `$${finalTotal.toFixed(2)}`;
}

function formatCurrency(n) {
    return '$' + Number(n).toFixed(2);
}

function updateReceiptTotal(itemsTotal, rewardsDiscount) {
    const discount = Number(rewardsDiscount) || 0;
    const subtotal = Number(itemsTotal) || 0;
    const finalTotal = Math.max(0, subtotal - discount); // don't go negative
    document.getElementById('receiptTotalAmount').textContent = formatCurrency(finalTotal);
    // if you also show orderTotal elsewhere, update that too:
    const orderTotalEl = document.getElementById('orderTotal');
    if (orderTotalEl) orderTotalEl.textContent = formatCurrency(finalTotal);
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
// Save cart before clearing for receipt display
const cartForReceipt = JSON.parse(localStorage.getItem("grillzillaCart")) || cart;
displayReceipt(orderNumber, cartForReceipt);

// Calculate total spent for points
let totalSpent = 0;
cartForReceipt.forEach(item => {
  totalSpent += item.price * item.quantity;
});

// Add points based on spending (10 points per $1, or 1 point per $0.10)
const currentUser = localStorage.getItem("currentUser");
if (currentUser) {
  const currentPoints = JSON.parse(localStorage.getItem("points")) || 0;
  const pointsEarned = Math.floor(totalSpent * 10);
  const newPoints = currentPoints + pointsEarned;
  localStorage.setItem("points", JSON.stringify(newPoints));
  console.log(`Added ${pointsEarned} points. Total: ${newPoints}`);
}

// Clear redeemed rewards after order completes
localStorage.removeItem("redeemedRewards");

// Hide checkout form, show receipt
document.getElementById("checkout-container").style.display = "none";
document.getElementById("receiptSection").style.display = "block";

// Clear cart after receipt is built
localStorage.removeItem("grillzillaCart");
cart = []; // Clear in-memory cart
}

function displayReceipt(orderNumber, cartData) {
const receiptItems = document.getElementById("receiptItems");
const receiptTotalAmountSpan = document.getElementById("receiptTotalAmount");
const orderNumberSpan = document.getElementById("orderNumber");
const receiptRewards = document.getElementById("receiptRewards");

console.log("displayReceipt called with:", { orderNumber, cartData });

orderNumberSpan.textContent = orderNumber;
receiptItems.innerHTML = "";

// Check if user is logged in
const currentUser = localStorage.getItem("currentUser");
const isLoggedIn = !!currentUser;

console.log("User logged in:", currentUser);

// Get redeemed rewards to apply free item discounts (only if logged in)
const redeemedRewards = isLoggedIn ? (JSON.parse(localStorage.getItem("redeemedRewards")) || []) : [];
console.log("Redeemed rewards from storage:", redeemedRewards);

// Map free item rewards to item names/types they apply to
const freeItemMap = {
  "Free Small Drink": "drinks",  // Match drinks section
  "Free Side": "sides",           // Match sides section
  "Free Appetizer": "appetizers", // Match appetizers section
  "Free Entrée": "entrees",       // Match entrees section
  "Free Dessert": "desserts"      // Match desserts section
};

// Count how many of each free reward we have
const freeRewardCounts = {};
redeemedRewards.forEach(reward => {
  if (freeItemMap[reward]) {
    freeRewardCounts[reward] = (freeRewardCounts[reward] || 0) + 1;
  }
});

console.log("Free reward counts:", freeRewardCounts);

let total = 0;
const savedCart = cartData || [];

console.log("Cart data in receipt:", savedCart);

// Process cart items, zeroing out ONE free item per reward type
savedCart.forEach(item => {
  let itemPrice = item.price;
  let quantityToCharge = item.quantity;
  
  // Check if this item should have a free instance based on redeemed rewards
  if (item.category) {
    for (const [reward, category] of Object.entries(freeItemMap)) {
      if (item.category === category && freeRewardCounts[reward] > 0) {
        // Only make ONE item free, charge for the rest
        quantityToCharge = item.quantity - 1;
        freeRewardCounts[reward]--;  // Use up one reward
        console.log("Applied free reward to one instance of:", item.name);
        break;
      }
    }
  }
  
  total += itemPrice * quantityToCharge;

  const row = document.createElement("div");
  row.classList.add("receipt-item");
  
  // Show quantity breakdown if a free item was applied
  if (quantityToCharge < item.quantity) {
    row.innerHTML = `
      <span>${item.quantity}× ${item.name} (1 free)</span>
      <span>$${(itemPrice * quantityToCharge).toFixed(2)}</span>
    `;
  } else {
    row.innerHTML = `
      <span>${item.quantity}× ${item.name}</span>
      <span>$${(itemPrice * quantityToCharge).toFixed(2)}</span>
    `;
  }
  receiptItems.appendChild(row);
});

console.log("Subtotal after free items:", total);

// Calculate remaining dollar-amount discounts
let totalDiscount = 0;
if (redeemedRewards.length > 0) {
  totalDiscount = redeemedRewards.reduce((acc, r) => acc + calculateRewardDiscount(r), 0);
  console.log("Total discount calculated:", totalDiscount);
  
  receiptRewards.innerHTML = `
    <h3>Redeemed Rewards:</h3>
    <ul>
      ${redeemedRewards.map(reward => `<li>${reward}</li>`).join("")}
    </ul>
  `;
} else {
  receiptRewards.innerHTML = "";
}

const finalTotal = Math.max(0, total - totalDiscount);

console.log("Final total:", finalTotal, "(" + total + " - " + totalDiscount + ")");

// Update receipt display: keep the label, update the amount span
if (receiptTotalAmountSpan) {
  receiptTotalAmountSpan.textContent = `$${finalTotal.toFixed(2)}`;
  console.log("Updated receiptTotalAmountSpan to:", `$${finalTotal.toFixed(2)}`);
}

// Also update the checkout page's order total if present
const orderTotalEl = document.getElementById('orderTotal');
if (orderTotalEl) orderTotalEl.textContent = `$${finalTotal.toFixed(2)}`;
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
