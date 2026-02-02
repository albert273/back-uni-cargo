const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectToDB = require("../config/connectToDb");
const globalError = require("../middlewares/errorMiddleware");
const ApiError = require("../utils/apiError");

// Routes
const UserRoute = require("../routers/users.route");
const AuthRoute = require("../routers/auth.routers");
const MessageRoute = require("../routers/message.route");
const QuoteRoute = require("../routers/quote.route");

const app = express();

// DB
connectToDB();

// Middlewar
app.use(cors({
  origin: "*",
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/api/user", UserRoute);
app.use("/api/auth", AuthRoute);
app.use("/api/message", MessageRoute);
app.use("/api/quote", QuoteRoute);

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is running on Vercel" });
});

// 404
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find ${req.originalUrl}`, 404));
});

// Global error handler
app.use(globalError);

// ⛔ NO app.listen()
module.exports = app;
