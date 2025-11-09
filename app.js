// ---------------------------
// app.js — Express App Setup (No Server Listen Here)
// ---------------------------

// Register module alias for cleaner import paths
require("module-alias/register");

// Import required modules
const http = require("http");
const path = require("path");
const passport = require("./config"); // Passport configuration
const session = require("express-session");
const express = require("express");
const socketio = require("socket.io");
const sessionStorage = require("@libs/sessionStore");
const morgan = require("morgan");
const helmet = require("helmet");
// Create an Express application
const app = express();

// Create an HTTP server (for use in cluster worker)
const server = http.createServer(app);

// Attach Socket.io
const io = socketio(server);
io.on("connection", (socket) => {
  console.info("A client connected");
});

// ---------------------------
// Database & Middleware Setup
// ---------------------------

require("@libs/db"); // Initialize DB

const { checkDBConnection } = require("@middlewares/all.middleware");
const Channel = require("@models/channel.model");

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Serve static files
app.use(express.static("public"));

// Request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session management
app.use(
  session({
    secret: "secret",
    resave: false,
    store: sessionStorage,
    saveUninitialized: false,
  })
);

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Logging middleware
app.use(morgan("combined"));

app.use(helmet());
app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true }));

// Custom middleware
app.use(checkDBConnection);

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Attach user data to views
app.use(async (req, res, next) => {
  res.locals.isCreateChannel = false;
  if (req.user) {
    res.locals.channel = req.channel = req.user;
  } else {
    req.channel = res.locals.channel = null;
  }
  next();
});

// ---------------------------
// Routes
// ---------------------------
const routes = require("./routes");
app.use("/", checkDBConnection, routes);

// 404 handler
app.use((req, res) => {
  res.status(404).render("404");
});

// ---------------------------
// Error Handling
// ---------------------------
process.on("unhandledRejection", (reason, promise) => {
  console.error(
    `[${new Date().toISOString()}] Unhandled Rejection:`,
    reason,
    "at:",
    promise
  );
});

process.on("uncaughtException", (error) => {
  console.error(`[${new Date().toISOString()}] Uncaught Exception:`, error);
  process.exit(1);
});

// ---------------------------
// Export for Cluster.js
// ---------------------------
module.exports = app;
