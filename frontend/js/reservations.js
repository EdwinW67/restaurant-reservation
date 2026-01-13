
//const API_BASE = "{{API_BASE}}";

const API_BASE = "http://localhost:3001";

// Adjust this if you front your backend differently in production.
//const API_BASE = "http://host.docker.internal:3001";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reservation-form");
  const messageEl = document.getElementById("reservation-message");

  if (!form) {
    console.warn("Reservation form not found on this page.");
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    messageEl.textContent = "";
    messageEl.className = "message";

    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      guests: Number(formData.get("guests")),
      date: formData.get("date"),
      time: formData.get("time")
    };

    try {
      const response = await fetch(`${API_BASE}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        console.error("Reservation failed:", response.status, errorBody);
        messageEl.textContent = errorBody.error || "Failed to save reservation. Please try again.";
        messageEl.classList.add("error");
        return;
      }

      const data = await response.json();
      console.log("Reservation created:", data);

      messageEl.textContent = "Your reservation has been saved. We look forward to seeing you!";
      messageEl.classList.add("success");
      form.reset();
    } catch (err) {
      console.error("Network or unexpected error:", err);
      messageEl.textContent = "Something went wrong. Please try again later.";
      messageEl.classList.add("error");
    }
  });
});
