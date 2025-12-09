// John Costigan - Rewards Page JS //


// Variables for points, rewards, and redeemed rewards display
points = JSON.parse(localStorage.getItem("points")) || 500
const rewardBag = document.getElementsByClassName("reward");
const pointCount = document.getElementById("pointCount")
const rewards = Array.from(rewardBag);
let redeemedRewards = JSON.parse(localStorage.getItem("redeemedRewards")) || [];
const redeemedElem = document.getElementById("redeemedRewards");
 console.log(redeemedRewards);

// Check if user is logged in
const currentUser = localStorage.getItem("currentUser");
const isLoggedIn = !!currentUser;

console.log("User logged in:", currentUser);

// If not logged in, hide points and rewards section
if (!isLoggedIn) {
  const rewardsSection = document.getElementById("rewardChoices");
  const pointsection = document.getElementById("pointSection");
  const redeemedSection = document.getElementById("redeemedSection");
  const rewardheader = document.getElementById("rewardHead");
  const rewardfooter = document.getElementById("rewardFooter");
  rewardsSection.style.display = "none";
  pointsection.style.display = "none";
  redeemedSection.style.display = "none";
  rewardfooter.style.display = "none";
  rewardheader.textContent = "Please log in to view and redeem rewards.";
}
else {
  const rewardsDescription = document.getElementById("callAction");
  rewardsDescription.style.display = "none";
}

function rewardFunct(index){
  return rewards[index] || null;
}

if (pointCount) pointCount.textContent = `${points}`;

// for loop to add event listeners to the reward buttons / redeem functionality

for (let i = 0; i < rewardBag.length; i++) {
  const reward = rewardFunct(i);
  if (!reward) continue;

  const btn = reward.querySelector(".redeemButton");
  if (!btn) continue;

  btn.addEventListener("click", () => {
    const costText = reward.querySelector("p").textContent;
    const cost = parseInt(costText.match(/\d+/)[0]);
    if (points >= cost) {
      points -= cost;
      alert(`Redeemed! You have ${points} points left.`);
      pointCount.textContent = `${points}`;
    
    // Store redeemed reward
    const rewardName = reward.querySelector("h3").textContent;
    redeemedRewards.push(rewardName);
    localStorage.setItem("points", JSON.stringify(points));
    localStorage.setItem("redeemedRewards", JSON.stringify(redeemedRewards));
    console.log("Redeemed Rewards:", JSON.stringify(redeemedRewards));
    displayRedeemedRewards();
    }
    else {
      alert("Not enough points to redeem this reward.");
    }
  });
}

// Display redeemed rewards on the page

function displayRedeemedRewards() {
  // kept for backward compatibility — now delegates to renderRedeemedList
  renderRedeemedList();
}

// render a list with refund buttons
function renderRedeemedList() {
  if (!redeemedElem) return;
  redeemedElem.innerHTML = "";

  if (redeemedRewards.length === 0) {
    redeemedElem.textContent = "You have not redeemed any rewards yet.";
    return;
  }

  const ul = document.createElement("ul");
  ul.className = "redeemed-list";

  redeemedRewards.forEach((rewardName, idx) => {
    const li = document.createElement("li");
    li.className = "redeemed-item";

    const nameSpan = document.createElement("span");
    nameSpan.textContent = rewardName;
    nameSpan.className = "redeemed-name";

    const refundBtn = document.createElement("button");
    refundBtn.type = "button";
    refundBtn.textContent = "Refund";
    refundBtn.className = "refund-btn";
    refundBtn.dataset.index = idx;
    refundBtn.addEventListener("click", () => refundReward(idx));

    li.appendChild(nameSpan);
    li.appendChild(document.createTextNode(" "));
    li.appendChild(refundBtn);
    ul.appendChild(li);
  });

  redeemedElem.appendChild(ul);
}
// refund by index: remove from redeemedRewards, add points back, persist, update UI
function refundReward(index) {
  const rewardName = redeemedRewards[index];
  if (!rewardName) return;

  // try to find the original reward element to determine cost
  let refundAmount = 0;
  const rewardElem = rewards.find(r => r.querySelector("h3")?.textContent === rewardName);
  if (rewardElem) {
    const costText = rewardElem.querySelector("p")?.textContent || "";
    const match = costText.match(/\d+/);
    refundAmount = match ? parseInt(match[0], 10) : 0;
  }

  // remove from array and give points back
  redeemedRewards.splice(index, 1);
  points = (typeof points === "number" ? points : parseInt(points, 10) || 0) + refundAmount;

  // persist changes
  localStorage.setItem("redeemedRewards", JSON.stringify(redeemedRewards));
  localStorage.setItem("points", JSON.stringify(points));

  // update UI
  if (pointCount) pointCount.textContent = `${points}`;
  renderRedeemedList();
  console.log(`Refunded "${rewardName}" for ${refundAmount} points.`);
}

displayRedeemedRewards();



// need to make a function so that rewards are stored and then able to modify the cart

function storeRedeemed(rewardElem) {
  if (!rewardElem) return;
  const rewardName = rewardElem.querySelector("h3")?.textContent || "Unknown Reward";
  redeemedRewards.push(rewardName);
  console.log("Redeemed Rewards:", redeemedRewards);
}

// Console log to verify script is linked

console.log("Rewards JS Linked Successfully");

// Interactivity with Checkout Page




// John Costigan - Rewards JS //