const API_BASE = "http://localhost:3001";


async function loadReservations() {
  const response = await fetch(`${API_BASE}/admin/reservations`, {
    credentials: "include"
  });

  if (!response.ok) {
    document.getElementById("admin-message").textContent =
      "Unauthorized. Please log in.";
    window.location.href = "admin-login.html";
    return;
  }

  const reservations = await response.json();
  const tbody = document.querySelector("#reservations-table tbody");

  reservations.forEach(r => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${r.name}</td>
      <td>${r.email}</td>
      <td>${r.guests}</td>
      <td>${r.date}</td>
      <td>${r.time}</td>
      <td>
        <button class="edit-btn" data-id="${r.id}">Edit</button>
        <button class="delete-btn" data-id="${r.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

document.getElementById("logout-btn").addEventListener("click", async () => {
  await fetch(`${API_BASE}/admin/logout`, {
    method: "POST",
    credentials: "include"
  });
  window.location.href = "admin-login.html";
});

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.dataset.id;

    if (!confirm("Delete this reservation?")) return;

    await fetch(`${API_BASE}/admin/reservations/${id}`, {
      method: "DELETE",
      credentials: "include"
    });

    location.reload();
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit-btn")) {
    const id = e.target.dataset.id;
    const row = e.target.closest("tr").children;

    document.getElementById("edit-id").value = id;
    document.getElementById("edit-name").value = row[0].innerText;
    document.getElementById("edit-email").value = row[1].innerText;
    document.getElementById("edit-guests").value = row[2].innerText;
    document.getElementById("edit-date").value = row[3].innerText;
    document.getElementById("edit-time").value = row[4].innerText;

    document.getElementById("edit-modal").classList.remove("hidden");
  }
});

document.getElementById("close-modal").onclick = () => {
  document.getElementById("edit-modal").classList.add("hidden");
};

document.getElementById("edit-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("edit-id").value;

  const payload = {
    name: document.getElementById("edit-name").value,
    email: document.getElementById("edit-email").value,
    guests: document.getElementById("edit-guests").value,
    date: document.getElementById("edit-date").value,
    time: document.getElementById("edit-time").value
  };

  await fetch(`${API_BASE}/admin/reservations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload)
  });

  location.reload();
});

document.getElementById("apply-filters").addEventListener("click", () => {
  const name = document.getElementById("filter-name").value.toLowerCase();
  const date = document.getElementById("filter-date").value;

  document.querySelectorAll("#reservations-table tbody tr").forEach(row => {
    const rowName = row.children[0].innerText.toLowerCase();
    const rowDate = row.children[3].innerText;

    const matchName = !name || rowName.includes(name);
    const matchDate = !date || rowDate === date;

    row.style.display = matchName && matchDate ? "" : "none";
  });
});



loadReservations();
