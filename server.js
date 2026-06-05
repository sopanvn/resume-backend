const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const resumeRoutes = require("./routes/resume");

const protect = require("./middleware/authMiddleware");

const app = express();

// DB connection
connectDB();

// Middlewares
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

// ================= ROUTES =================

// Home route
app.get("/", (req, res) => {
  res.send("Resume Analyzer API Running");
});

// Auth routes
app.use("/api/auth", authRoutes);

// Resume routes
app.use("/api/resume", resumeRoutes);

// Protected test route
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You accessed protected data",
    user: req.user
  });
});

// ================= START SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
