const helmet = require("helmet");
// const cors = require("cors");
const rateLimit = require("express-rate-limit");

const FRONTEND_URL = process.env.ORIGIN || "http://localhost:5005";

const baseLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many auth requests, please try again later.",
});

function applySecurity(app) {
  app.set("trust proxy", 1);
  // { origin: [FRONTEND_URL] }
  app.use(cors());
  app.use(helmet());
  app.use(baseLimiter);
}

module.exports = { applySecurity, authLimiter };
