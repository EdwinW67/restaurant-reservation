const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const nodemailer = require("nodemailer");
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("./swagger.json");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");

const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;

// Simple in-memory session store 
const sessions = new Set();
function requireAuth(req, res, next) {
  const token = req.cookies.session;
  if (!token || !sessions.has(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = crypto.randomBytes(32).toString("hex");
    sessions.add(token); res.cookie("session", token, {
      httpOnly: true, sameSite: "strict", secure: false // set to true if using HTTPS 
    }); return res.json({ success: true });
  } res.status(401).json({ error: "Invalid credentials" });
});

app.post("/admin/logout", (req, res) => {
  const token = req.cookies.session; if (token) sessions.delete(token); res.clearCookie("session"); res.json({ success: true });
});

app.get("/admin/reservations", requireAuth, async (req, res) => {
   const { date } = req.query; let result; if (date) { 
    result = await pool.query( "SELECT * FROM reservations WHERE date = $1 ORDER BY date, time", [date] ); } 
    else { result = await pool.query( "SELECT * FROM reservations ORDER BY date, time" ); } res.json(result.rows); 
  });

app.delete("/admin/reservations/:id", requireAuth, async (req, res) => {
  const id = req.params.id;
  await pool.query("DELETE FROM reservations WHERE id = $1", [id]);
  res.json({ success: true });
});

app.put("/admin/reservations/:id", requireAuth, async (req, res) => {
  const id = req.params.id;
  const { name, email, guests, date, time } = req.body;

  await pool.query(
    `UPDATE reservations 
     SET name=$1, email=$2, guests=$3, date=$4, time=$5 
     WHERE id=$6`,
    [name, email, guests, date, time, id]
  );

  res.json({ success: true });
});



// Swagger UI at /docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "restouser",
  password: process.env.DB_PASS || "restopass",
  database: process.env.DB_NAME || "restaurant"
});

if (process.env.NODE_ENV === "test") {
  app.delete("/test/cleanup", async (req, res) => {
    try {
      await pool.query("DELETE FROM reservations");
      res.json({ status: "ok" });
    } catch (err) {
      console.error("Cleanup failed:", err);
      res.status(500).json({ error: "Cleanup failed" });
    }
  });
}

// Email transport (configure via env, or fallback to console only)
let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

// Simple health check
app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

// GET all reservations
app.get("/reservations", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM reservations ORDER BY date, time"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching reservations:", err);
    res.status(500).json({ error: "Failed to fetch reservations" });
  }
});

// POST new reservation (and send email)
app.post("/reservations", async (req, res) => {
  try {

    console.log("Incoming reservation:", req.body);

    const { name, email, guests, date, time } = req.body;

    if (!name || !email || !guests || !date || !time) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await pool.query(
      "INSERT INTO reservations (name, email, guests, date, time) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [name, email, guests, date, time]

      );

    const reservation = result.rows[0];
    console.log("Inserted reservation:", result.rows[0]);


    // Try to send confirmation email (if transporter configured)
    if (transporter) {
      try {
        await transporter.sendMail({
          from: process.env.MAIL_FROM || process.env.SMTP_USER,
          to: email,
          subject: "Your table reservation",
          text: `Dear ${name},\n\nYour reservation is confirmed:\n- Guests: ${guests}\n- Date: ${date}\n- Time: ${time}\n\nThank you for choosing our restaurant!`
        });
      } catch (mailErr) {
        console.error("Failed to send confirmation email:", mailErr);
      }
    } else {
      console.log(
        `Email not configured. Would send confirmation to ${email} for reservation ID ${reservation.id}.`
      );
    }

    res.status(201).json(reservation);
  } catch (err) {
    console.error("Error creating reservation:", err);
    res.status(500).json({ error: "Failed to create reservation" });
  }
});

app.listen(3001, () => console.log("Backend running on port 3001"));
