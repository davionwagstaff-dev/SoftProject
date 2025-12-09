//Davion - Signup and Login//
const title = document.getElementById("form-title");
    const btn = document.getElementById("submit-btn");
    const toggle = document.getElementById("toggle-form");
    const message = document.getElementById("message");

    let isLogin = false;

    toggle.addEventListener("click", () => {
      isLogin = !isLogin;
      title.textContent = isLogin ? "Login" : "Sign Up";
      btn.textContent = isLogin ? "Login" : "Sign Up";
      toggle.textContent = isLogin
        ? "Sign up here"
        : "Login here";
      message.textContent = "";
    });

    btn.addEventListener("click", () => {
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!username || !password) {
        showMessage("Please fill in all fields", true);
        return;
      }

      if (isLogin) {
        loginUser(username, password);
      } else {
        registerUser(username, password);
      }
    });

    function registerUser(username, password) {
      if (localStorage.getItem(username)) {
        showMessage("Username already exists!", true);
      } else {
        localStorage.setItem(username, password);
        showMessage("Account created successfully! You can now login.");
      }
    }

    function loginUser(username, password) {
      const storedPassword = localStorage.getItem(username);
      if (storedPassword && storedPassword === password) {
        showMessage(`Welcome, ${username}! You are logged in.`);
        localStorage.setItem("currentUser", username);  // Store logged-in user
        window.location.href = "Menu.html" // John Costigan
      } else {
        showMessage("Invalid username or password.", true);
      }
    }

    function showMessage(msg, isError = false) {
      message.textContent = msg;
      message.className = isError ? "message error" : "message";
    }
//Davion - SignUp and Login//

