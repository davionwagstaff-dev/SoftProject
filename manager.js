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
                <span>${item.name} - $${item.price} [${item.category}]</span>
                <button onclick="editItem(${index})">Edit</button>
                <button onclick="deleteItem(${index})">Del</button>
            </div>
        `;
    });
}

// Validate and preview image URL
document.getElementById("addImageUrl").addEventListener("input", function() {
    const preview = document.getElementById("previewImage");
    const url = this.value.trim();

    // Basic validation: must look like an image URL
    const validExt = /\.(jpg|jpeg|png|gif|webp)$/i;
    if (url && validExt.test(url)) {
        preview.src = url;
    } else if (!url) {
        preview.src = "https://via.placeholder.com/150";
    } else {
        preview.src = "https://via.placeholder.com/150?text=Invalid+URL";
    }
});

function addItem() {
    let name = document.getElementById("addName").value.trim();
    let desc = document.getElementById("addDesc").value.trim();
    let price = document.getElementById("addPrice").value.trim();
    let category = document.getElementById("addCategory").value;
    let imageUrl = document.getElementById("addImageUrl").value.trim();
    let previewSrc = document.getElementById("previewImage").src;

    if (!name || !price || !category) {
        alert("Name, price, and category required.");
        return;
    }

    // If no valid image URL, fallback to placeholder
    if (!imageUrl || previewSrc.includes("Invalid")) {
        imageUrl = "https://via.placeholder.com/150";
    }

    saveNewItem(name, desc, price, category, imageUrl);
}

function saveNewItem(name, desc, price, category, image) {
    menuData.push({ name, desc, price: parseFloat(price), category, image });
    localStorage.setItem("menuItems", JSON.stringify(menuData));
    loadMenuList();

    // Clear fields
    document.getElementById("addName").value = "";
    document.getElementById("addDesc").value = "";
    document.getElementById("addPrice").value = "";
    document.getElementById("addCategory").value = "appetizers";
    document.getElementById("addImageUrl").value = "";
    document.getElementById("previewImage").src = "https://via.placeholder.com/150";
}

function editItem(i) {
    let newName = prompt("New name:", menuData[i].name);
    let newPrice = prompt("New price:", menuData[i].price);
    let newDesc = prompt("New description:", menuData[i].desc);
    let newCategory = prompt("New category:", menuData[i].category);
    let newImage = prompt("New image URL (or leave blank):", menuData[i].image);

    if (!newName || !newPrice || !newCategory) return alert("Name, price, and category required.");

    menuData[i] = { 
        name: newName, 
        price: parseFloat(newPrice), 
        desc: newDesc, 
        category: newCategory, 
        image: newImage || menuData[i].image 
    };

    localStorage.setItem("menuItems", JSON.stringify(menuData));
    loadMenuList();
}

function deleteItem(i) {
    menuData.splice(i, 1);
    localStorage.setItem("menuItems", JSON.stringify(menuData));
    loadMenuList();
}

function goToMenu() {
    window.location.href = "Menu.html";
}

// Display menu on Menu.html
document.addEventListener("DOMContentLoaded", () => {
    let savedMenu = JSON.parse(localStorage.getItem("menuItems")) || [];
    let section = document.querySelector(".featuredItems .itemGrid");
    if (section && savedMenu.length > 0) {
        savedMenu.forEach(item => {
            let div = document.createElement("div");
            div.className = "menuItem";
            div.innerHTML = `
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/150?text=Image+Error'">
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
                <span class="price">$${item.price}</span>
            `;
            section.appendChild(div);
        });
    }
});
