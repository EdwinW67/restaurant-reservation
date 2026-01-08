# Restaurant Reservation System

A full-stack restaurant reservation system built with:

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js + Express
- **Database:** PostgreSQL (running in Docker)
- **Admin Dashboard:** Protected route with session-based authentication
- **Email Notifications:** Nodemailer (configurable SMTP)

This project supports:
- Creating reservations from the public form
- Viewing reservations in the admin dashboard
- Filtering by date (optional)
- Automatic timestamps
- Dockerized development environment

---

## 🚀 Features

### Public Reservation Form
- Users can submit name, email, guests, date, and time
- Backend validates input
- Reservation is stored in PostgreSQL
- Confirmation email is attempted (SMTP configurable)

### Admin Dashboard
- Login-protected
- Displays all reservations
- Sorted by date and time
- Future support for filtering, pagination, and search

### Backend API
- `POST /reservations` — create reservation  
- `GET /admin/reservations` — list reservations  
- `POST /admin/login` — authenticate admin  

---

## 🐳 Running with Docker

```bash
docker compose up -d

Backend runs on:
http://localhost:3001

Frontend runs on:
http://localhost:3000

Database runs on:
localhost:5432

🧪 Testing the Database
Enter the DB container:
docker exec -it restaurant-reservation-db-1 psql -U restouser -d restaurant

List tables:
\dt

View reservations:
SELECT * FROM reservations;

📁 Project Structure
restaurant-reservation/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── ...
│
├── frontend/
│   ├── index.html
│   ├── admin.html
│   ├── scripts/
│   └── ...
│
├── docker-compose.yml
├── README.md
├── PROMPTS.md
└── ARCHITECTURE.md

📝 Notes
See PROMPTS.md for all development prompts and debugging steps.
See ARCHITECTURE.md for system design and flow.