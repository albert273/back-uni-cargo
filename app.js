const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectToDB = require("./config/connectToDb");
const globalError = require("./middlewares/errorMiddleware");
const ApiError = require("./utils/apiError");

// Init App FIRST
const app = express();

// Middlewares
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://your-frontend.vercel.app", // ⬅️ ADD your frontend URL
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// IMPORTANT: handle preflight requests
app.options("*", cors(corsOptions));

app.use(express.json());

// Connect to DB
connectToDB();

// Routes
const UserRoute = require("./routers/users.route");
const AuthRoute = require("./routers/auth.routers");
const MessageRoute = require("./routers/message.route");
const QuoteRoute = require("./routers/quote.route");

// APIs
app.use("/api/user", UserRoute);
app.use("/api/auth", AuthRoute);
app.use("/api/message", MessageRoute);
app.use("/api/quote", QuoteRoute);

// Handle undefined routes
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 404));
});

// Global error handler
app.use(globalError);

// Run server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error("Shutting down...");
    process.exit(1);
  });
});
