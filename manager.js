const adminUser = "manager";
const adminPass = "1234";

let menuData = JSON.parse(localStorage.getItem("menuItems")) || [];

function managerLogin() {
    const u = document.getElementById("managerUser").value;
    const p = document.getElementById("managerPass").value;

    if (u === adminUser && p === adminPass) {
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("managerPanel").style.display = "block";
        loadMenuList();
    } else {
        document.getElementById("loginMsg").innerText = "Invalid login.";
    }
}

function loadMenuList() {
    const box = document.getElementById("menuList");
    box.innerHTML = "";

    menuData.forEach((item, index) => {
        box.innerHTML += `
            <div class="menuRow">
                <span>${item.name} - $${item.price}</span>
                <button onclick="editItem(${index})">Edit</button>
                <button onclick="deleteItem(${index})">Del</button>
            </div>
        `;
    });
}

function addItem() {
    let name = document.getElementById("addName").value;
    let desc = document.getElementById("addDesc").value;
    let price = document.getElementById("addPrice").value;

    if (!name || !price) return alert("Name & price required.");

    menuData.push({ name, desc, price });
    localStorage.setItem("menuItems", JSON.stringify(menuData));
    loadMenuList();

    document.getElementById("addName").value = "";
    document.getElementById("addDesc").value = "";
    document.getElementById("addPrice").value = "";
}

function editItem(i) {
    let newName = prompt("New name:", menuData[i].name);
    let newPrice = prompt("New price:", menuData[i].price);
    let newDesc = prompt("New description:", menuData[i].desc);

    if (!newName || !newPrice) return alert("Name & price required.");

    menuData[i] = { name: newName, price: newPrice, desc: newDesc };
    localStorage.setItem("menuItems", JSON.stringify(menuData));
    loadMenuList();
}
function deleteItem(i) {
    menuData.splice(i, 1);
    localStorage.setItem("menuItems", JSON.stringify(menuData));
    loadMenuList();
}
