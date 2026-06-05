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
app.use(cors({
  origin: "*"
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
