# System Architecture

The Restaurant Reservation System is a Dockerized full-stack application consisting of:

---

## 1. Frontend

### Technologies
- HTML, CSS, JavaScript
- Served via a lightweight Node/Express container

### Responsibilities
- Display reservation form
- Submit reservation data to backend
- Admin dashboard UI
- Admin login form

### Key Files
- `index.html`
- `admin.html`
- `scripts/reservation.js`
- `scripts/admin.js`

---

## 2. Backend

### Technologies
- Node.js
- Express
- PostgreSQL client (pg)
- Express-session
- CORS
- Nodemailer

### Responsibilities
- Validate and store reservations
- Authenticate admin
- Serve admin reservation data
- Send confirmation emails

### API Routes
| Method | Route | Description |
|--------|--------|-------------|
| POST | `/reservations` | Create reservation |
| POST | `/admin/login` | Admin login |
| GET | `/admin/reservations` | List reservations (protected) |

---

## 3. Database

### Technology
- PostgreSQL (Docker)

### Schema

reservations (
id SERIAL PRIMARY KEY,
name TEXT NOT NULL,
email TEXT NOT NULL,
guests INTEGER NOT NULL,
date DATE NOT NULL,
time TIME NOT NULL,
created_at TIMESTAMP DEFAULT NOW()
)


---

## 4. Docker Architecture

+------------------+       +------------------+       +------------------+
|    Frontend      | <---> |     Backend      | <---> |   PostgreSQL     |
|  (localhost:3000)|       | (localhost:3001) |       |   (localhost:5432)|
+------------------+       +------------------+       +------------------+


---

## 5. Authentication Flow

1. Admin submits login form  
2. Backend validates credentials  
3. Session cookie is set  
4. Admin dashboard fetches data with `credentials: include`  
5. Backend checks session before returning data

---

## 6. Error Handling

- Input validation on backend
- Graceful handling of email failures
- CORS configured for credentialed requests
- Debug logging for inserts and admin queries

