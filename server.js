const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const resumeRoutes = require("./routes/resume");
const protect = require("./middleware/authMiddleware");

const app = express();

// ================= DB =================
connectDB();

// ================= CORS CONFIG =================
const allowedOrigins = [
  "http://localhost:5173",
  "https://resume-analyser-81bryralz-sopann.vercel.app"
];

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://resume-analyser-81bryralz-sopann.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// IMPORTANT: DO NOT use app.options("*", cors())

// ✅ Handle preflight requests properly
app.options("*", cors());

// ================= MIDDLEWARES =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= ROUTES =================
app.get("/", (req, res) => {
  res.send("Resume Analyzer API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

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
