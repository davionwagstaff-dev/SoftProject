// John Costigan - Rewards Page JS //

points = 2500; // Example starting points, Later this will update with user data
const rewardBag = document.getElementsByClassName("reward");
const pointCount = document.getElementById("pointCount")

// for loop to add event listeners to the reward buttons / redeem functionality
pointCount.textContent = `${points}`;
for (let i = 0; i < rewardBag.length; i++) {
  const reward = rewardBag[i];
  console.log(`found reward ${i + 1}`, reward);
  reward.querySelector(".redeemButton").addEventListener("click", () => {
    const costText = reward.querySelector("p").textContent;
    const cost = parseInt(costText.match(/\d+/)[0]);
    if (points >= cost) {
      points -= cost;
      alert(`Redeemed! You have ${points} points left.`);
      pointCount.textContent = `${points}`;
    } else {
      alert("Not enough points to redeem this reward.");
    }
});
}


// John Costigan - Rewards Page JS //