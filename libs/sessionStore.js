const mongoDBStore = require("connect-mongo");

const sessionStore = mongoDBStore.create({
    mongoUrl : process.env.SESSION_STORE || "mongodb://localhost:27017/devTube-emergency",
    collectionName : "sessions",
    ttl : 24 * 60 * 60,
});

module.exports = sessionStore;