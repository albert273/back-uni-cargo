const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectToDB = require("../config/connectToDb");
const globalError = require("../middlewares/errorMiddleware");
const ApiError = require("../utils/apiError");

// Init app FIRST
const app = express();

// ✅ CORS (allow localhost + future frontend)
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://your-frontend.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// ✅ Handle preflight
app.options("*", cors());

// Middleware
app.use(express.json());

// Connect to DB (should be MongoDB Atlas, not localhost)
connectToDB();

// Routes
app.use("/api/user", require("../routers/users.route"));
app.use("/api/auth", require("../routers/auth.routers"));
app.use("/api/message", require("../routers/message.route"));
app.use("/api/quote", require("../routers/quote.route"));

// Test route (VERY IMPORTANT)
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", env: process.env.NODE_ENV });
});

// Not found
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find route: ${req.originalUrl}`, 404));
});

// Global error handler
app.use(globalError);

module.exports = app;
