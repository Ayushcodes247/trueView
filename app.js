require("module-alias/register");
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

const path = require("path");
const session = require("express-session");
const passport = require("./config");
const morgan = require("morgan");
const helmet = require("helmet");
const routes = require("./routes");
const sessionStore = require("@libs/sessionStore");
const http = require("http");
const server = http.createServer(app);
const socketIO = require("socket.io");
const io = socketIO(server);

const PORT = process.env.PORT || 3001;

require("@libs/db");

const { checkDBConnection } = require("@middlewares/all.middleware");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(morgan("combined"));

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(checkDBConnection);

app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(helmet());
app.use(helmet.hsts({ maxAge: 3153600, includeSubDomains: true }));

app.use(async (req, res, next) => {
  res.locals.isCreateChannel = false;
  if (req.user) {
    res.locals.channel = req.channel = req.user;
  } else {
    req.channel = res.locals.channel = null;
  }
  next();
});

app.use("/", checkDBConnection, routes);

app.use((req, res) => {
  res.status(404).render("404");
});

server.listen(PORT, () => {
  console.log(
    `[${new Date().toISOString()}] TrueView Server is running on port ${PORT}`
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error(
    `[${new Date().toISOString()}] Unhandled Rejection at:`,
    promise,
    "reason:",
    reason
  );
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error(`[${new Date().toISOString()}] Uncaught Exception:`, error);
  process.exit(1); // Exit process to allow process manager (e.g., PM2) to restart
});

// Graceful shutdown on termination signals
const gracefulShutdown = (signal) => {
  console.log(
    `[${new Date().toISOString()}] Received ${signal}. Closing server gracefully...`
  );
  server.close(() => {
    console.log(
      `[${new Date().toISOString()}] Server closed. Exiting process.`
    );
    process.exit(0);
  });

  // Force exit if server hangs after 30s
  setTimeout(() => {
    console.error(
      `[${new Date().toISOString()}] Forcefully exiting process due to timeout.`
    );
    process.exit(1);
  }, 30_000).unref();
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

module.exports = { app, io };
