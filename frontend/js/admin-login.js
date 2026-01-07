const API_BASE = "http://localhost:3001";

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const message = document.getElementById("login-message");

  const response = await fetch(`${API_BASE}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include"
  });

  if (response.ok) {
    window.location.href = "admin.html";
  } else {
    message.textContent = "Invalid username or password";
    message.classList.add("error");
  }
});
