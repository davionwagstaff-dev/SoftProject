
  const categories = document.querySelectorAll('.category');
  const sections = document.querySelectorAll('.menuSection');

  categories.forEach(category => {
    category.addEventListener('click', () => {
      const targetId = category.getAttribute('data-target');

    
      sections.forEach(section => section.classList.add('hidden'));

    
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.remove('hidden');
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    }); 
  });    
// Davion
let cart = JSON.parse(localStorage.getItem("grillzillaCart")) || [];

window.addEventListener("DOMContentLoaded", () => {
const items = document.querySelectorAll(".menuItem");
items.forEach(item => {
item.addEventListener("click", () => {
const name = item.querySelector("h3").textContent;
const priceText = item.querySelector(".price").textContent.replace("$", "");
const price = parseFloat(priceText);

addToCart(name, price);
});
});
});

function addToCart(name, price) {
const existing = cart.find(item => item.name === name);
if (existing) {
existing.quantity++;
} else {
cart.push({ name, price, quantity: 1 });
}
saveCart();
updateCartDisplay();
}

function saveCart() {
localStorage.setItem("grillzillaCart", JSON.stringify(cart));
}

function updateCartDisplay() {
const cartBox = document.getElementById("cartBox");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

cartItems.innerHTML = "";
let total = 0;

cart.forEach(item => {
total += item.price * item.quantity;

const div = document.createElement("div");
div.classList.add("cart-row");
div.innerHTML = `
<span>${item.name}</span>
<span>$${item.price.toFixed(2)}</span>

<div class="qtyBox">
<button class="qtyBtn minus">−</button>
<span>${item.quantity}</span>
<button class="qtyBtn plus">+</button>
</div>

<button class="removeBtn">Remove</button>
`;

div.querySelector(".minus").addEventListener("click", () => changeQty(item.name, -1));
div.querySelector(".plus").addEventListener("click", () => changeQty(item.name, 1));
div.querySelector(".removeBtn").addEventListener("click", () => removeItem(item.name));

cartItems.appendChild(div);
});

cartTotal.textContent = `$${total.toFixed(2)}`;
cartBox.style.display = "block";
cartBox.classList.add("cartOpen");
}

function changeQty(name, amount) {
const item = cart.find(i => i.name === name);
if (!item) return;

item.quantity += amount;
if (item.quantity <= 0) {
removeItem(name);
return;
}

saveCart();
updateCartDisplay();
}

function removeItem(name) {
cart = cart.filter(item => item.name !== name);
saveCart();
updateCartDisplay();
}

function closeCart() {
const box = document.getElementById("cartBox");
box.classList.remove("cartOpen");
setTimeout(() => box.style.display = "none", 200);
}

function checkout() {
window.location.href = "checkout.html";
}
// Davion

document.addEventListener("DOMContentLoaded", () => {
  
  const breakfastCutoffHour = 11;
  const now = new Date();
  const currentHour = now.getHours();

  const breakfastSection = document.getElementById("breakfast");

  function disableBreakfastSection() {
    breakfastSection.classList.add("disabled");
    breakfastSection.style.pointerEvents = "none";
    breakfastSection.style.opacity = "0.5";

    const message = document.createElement("p");
    message.textContent = "Breakfast is no longer available after 11:00 AM.";
    message.style.color = "red";
    message.style.textAlign = "center";
    breakfastSection.appendChild(message);
  }

  if (currentHour >= breakfastCutoffHour && !breakfastSection.classList.contains("disabled")) {
    disableBreakfastSection();
  }
});
function openCartFromNav() {
  updateCartDisplay();
}