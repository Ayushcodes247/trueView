const http = require("http");
const app = require("./app"); // Import Express app
require("dotenv").config(); // Load environment variables

// Use environment variable PORT or default to 3001
const PORT = process.env.PORT || 3001;

// Create HTTP server with Express app
const server = http.createServer(app);

// Start server and listen for incoming requests
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
