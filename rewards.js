// John Costigan - Rewards Page JS //

points = 2500; // Example starting points, Later this will update with user data
const rewardBag = document.getElementsByClassName("reward");
const pointCount = document.getElementById("pointCount")
const rewards = Array.from(rewardBag);
let redeemedRewards = [];

// Function to create reward variables

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
    console.log("Redeemed Rewards:", redeemedRewards);
    }
    else {
      alert("Not enough points to redeem this reward.");
    }
  });
}

// Display redeemed rewards on the page
const redeemedElem = document.getElementById("redeemedRewards");
function displayRedeemedRewards() {
  if (!redeemedElem) return;
  if (redeemedRewards.length === 0) {
    redeemedElem.textContent = "You have not redeemed any rewards yet.";
  } else {
    redeemedElem.textContent = redeemedRewards.join(", ");
  }
}
setInterval(displayRedeemedRewards, 1000);


// need to make a function so that rewards are stored and then able to modify the cart

function storeRedeemed(rewardElem) {
  if (!rewardElem) return;
  const rewardName = rewardElem.querySelector("h3")?.textContent || "Unknown Reward";
  redeemedRewards.push(rewardName);
  console.log("Redeemed Rewards:", redeemedRewards);
}

// John Costigan - Rewards JS //